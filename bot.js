const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is alive!");
});

app.listen(3000, () => {
  console.log("Web server running on port 3000");
});

const {
Client,
GatewayIntentBits,
EmbedBuilder,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle,
Events
} = require("discord.js")

const fs = require("fs")

const client = new Client({
intents:[
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.MessageContent
]
})

const TOKEN = "process.env.TOKEN"

let data = {}

if(fs.existsSync("data.json")){
data = JSON.parse(fs.readFileSync("data.json"))
}

function save(){
fs.writeFileSync("data.json",JSON.stringify(data,null,2))
}

function getUser(id){

if(!data[id]){
data[id] = {
xu: 0,
inventory: [],
daily: 0,
mission: false,
missionDone: false,
missionCount: 0,
lastMessage: 0
}
}

if(typeof data[id].xu !== "number"){
data[id].xu = 0
}

if(!Array.isArray(data[id].inventory)){
data[id].inventory = []
}

if(!data[id].missionCount){
data[id].missionCount = 0
}

if(!data[id].lastMessage){
data[id].lastMessage = 0
}

return data[id]

}

function resetMission(user){

let today = new Date().toDateString()

if(user.missionDate !== today){

user.missionDate = today
user.missionsToday = []

user.dailyMissions = missionPool
.sort(()=>0.5-Math.random())
.slice(0,5)

}

}

const shopPages = [

[
{name:"NEWBIE",price:125,role:"1481224660363251733"},
{name:"TÂN CẤP",price:147,role:"1481224717682741288"},
{name:"VIP",price:250,role:"1481224759617257635"},
{name:"PLUS+",price:900,role:"1479062952861630465"},
{name:"KING+++",price:4000,role:"1481224874432139357"}
],

[
{name:"ROBLOX",price:20,role:"1481225140888145951"},
{name:"Minecraft",price:50,role:"1481225187222356041"},
{name:"KING OF TSB",price:250,role:"1481225232315322530"},
{name:"DOORS+",price:100,role:"1481225292990251172"}
],

[
{name:"BRAINROT",price:10,role:"1481225340591542334"},
{name:"Làm bài GDDP",price:10,role:null},
{name:"Làm bài GDDP+",price:50,role:null},
{name:"Cày Robux 400",price:2000,role:null}
]

]

const missionPool = [

{ id:"msg5", name:"Gửi 5 tin nhắn", type:"message", goal:5, reward:20 },
{ id:"msg10", name:"Gửi 10 tin nhắn", type:"message", goal:10, reward:30 },
{ id:"msg15", name:"Gửi 15 tin nhắn", type:"message", goal:15, reward:40 },
{ id:"msg20", name:"Gửi 20 tin nhắn", type:"message", goal:20, reward:45 },
{ id:"time1", name:"Chat 1 phút", type:"time", goal:60000, reward:15 }

]

function createShop(page){

let items = shopPages[page]

let embed = new EmbedBuilder()
.setTitle("🛒 SHOP SERVER")
.setDescription("💰 **Tiền tệ: XU**")
.addFields(
items.map(i=>({
name:i.name,
value:`${i.price} xu`,
inline:true
}))
)
.setFooter({text:`Trang ${page+1}/${shopPages.length}`})

let row1 = new ActionRowBuilder()

items.forEach((item,i)=>{

row1.addComponents(
new ButtonBuilder()
.setCustomId(`buy_${page}_${i}`)
.setLabel(`Mua ${item.name}`)
.setStyle(ButtonStyle.Primary)
)

})

let row2 = new ActionRowBuilder()
.addComponents(
new ButtonBuilder()
.setCustomId(`prev_${page}`)
.setLabel("⬅")
.setStyle(ButtonStyle.Secondary),

new ButtonBuilder()
.setCustomId(`next_${page}`)
.setLabel("➡")
.setStyle(ButtonStyle.Secondary)
)

return {embed,row1,row2}

}

client.on(Events.InteractionCreate, async interaction => {

if(interaction.isChatInputCommand()){

if(interaction.commandName === "kiemtratien"){

let user = getUser(interaction.user.id)

interaction.reply(`💰 Bạn có **${user.xu} xu**`)

}

if(interaction.commandName === "inventory"){

let user = getUser(interaction.user.id)

interaction.reply(`🎒 Inventory:\n${user.inventory.join("\n") || "Trống"}`)

}

if(interaction.commandName === "daily"){

let user = getUser(interaction.user.id)

let now = Date.now()

if(now - user.daily < 86400000){

return interaction.reply({
content:"❌ Bạn đã nhận daily hôm nay",
ephemeral:true
})

}

user.daily = now
user.xu += 20

save()

interaction.reply("🎁 Bạn nhận **20 xu**")

}

if(interaction.commandName === "nhiemvu"){

let user = getUser(interaction.user.id)

resetMission(user)

if(user.missionsToday.length >= 5){

return interaction.reply({
content:"❌ Hôm nay bạn đã làm đủ **5 nhiệm vụ**",
ephemeral:true
})

}

if(user.mission){

return interaction.reply({
content:"❌ Bạn đang làm nhiệm vụ khác",
ephemeral:true
})

}

let available = user.dailyMissions.filter(m=>!user.missionsToday.includes(m.id))

let row = new ActionRowBuilder()

available.slice(0,5).forEach(m=>{

row.addComponents(
new ButtonBuilder()
.setCustomId(`mission_${m.id}`)
.setLabel(`${m.name} (+${m.reward} xu)`)
.setStyle(ButtonStyle.Primary)
)

})

interaction.reply({
content:"📜 **Chọn nhiệm vụ:**",
components:[row],
ephemeral:true
})

}

if(interaction.commandName === "resetxu"){

if(!interaction.member.permissions.has("Administrator")){
return interaction.reply({
content:"❌ Chỉ Admin dùng được",
ephemeral:true
})
}

for(let id in data){
data[id].xu = 0
}

save()

interaction.reply("⚠️ Đã reset xu toàn server")

}

if(interaction.commandName === "top"){

let top = Object.entries(data)
.sort((a,b)=>b[1].xu-a[1].xu)
.slice(0,10)
.map((u,i)=>`${i+1}. <@${u[0]}> - ${u[1].xu} xu`)
.join("\n")

interaction.reply(`🏆 TOP GIÀU NHẤT\n${top}`)

}

if(interaction.commandName === "xoaxu"){

if(!interaction.member.permissions.has("Administrator")){
return interaction.reply({
content:"❌ Chỉ Admin dùng được",
ephemeral:true
})
}

let target = interaction.options.getUser("nguoi")

let user = getUser(target.id)

user.xu = 0

save()

interaction.reply(`⚠️ Đã reset xu của <@${target.id}>`)

}

if(
interaction.commandName === "capxu" ||
interaction.commandName === "truxu" ||
interaction.commandName === "setxu"
){

if(!interaction.member.permissions.has("Administrator")){
return interaction.reply({
content:"❌ Chỉ Admin mới dùng được",
ephemeral:true
})
}

let target = interaction.options.getUser("nguoi")
let amount = interaction.options.getInteger("soxu")

let user = getUser(target.id)

if(interaction.commandName === "capxu"){
user.xu += amount
interaction.reply(`💰 Đã cấp **${amount} xu** cho <@${target.id}>`)
}

if(interaction.commandName === "resetxuuser"){

try{

if(!interaction.member.permissions.has("Administrator")){
return interaction.reply({
content:"❌ Chỉ Admin mới dùng được",
ephemeral:true
})
}

let target = interaction.options.getUser("nguoi")

if(!target){
return interaction.reply({
content:"❌ Không tìm thấy người dùng",
ephemeral:true
})
}

let user = getUser(target.id)

user.xu = 0

save()

return interaction.reply(`⚠️ Đã reset xu của <@${target.id}>`)

}catch(err){

console.log(err)

if(!interaction.replied){
interaction.reply({
content:"❌ Lỗi khi reset xu",
ephemeral:true
})
}

}

}

if(interaction.commandName === "truxu"){
user.xu -= amount
if(user.xu < 0) user.xu = 0
interaction.reply(`💸 Đã trừ **${amount} xu** của <@${target.id}>`)
}

if(interaction.commandName === "setxu"){
user.xu = amount
interaction.reply(`⚙️ Đã đặt xu của <@${target.id}> thành **${amount}**`)
}

save()

}

if(interaction.commandName === "napthe"){

await interaction.deferReply({ ephemeral:true })

let loai = interaction.options.getString("loai")
let menhgia = interaction.options.getInteger("menhgia")
let seri = interaction.options.getString("seri")
let mathe = interaction.options.getString("mathe")

const adminChannel = "1480930014756212736"

let channel = await client.channels.fetch(adminChannel)

let xu = menhgia / 1000

let embed = new EmbedBuilder()
.setTitle("💳 NẠP THẺ MỚI")
.addFields(
{ name:"👤 Người gửi", value:`<@${interaction.user.id}>` },
{ name:"📱 Loại thẻ", value:loai },
{ name:"💰 Mệnh giá", value:`${menhgia}` },
{ name:"💎 Xu sẽ nhận", value:`${xu}` },
{ name:"🔢 Seri", value:seri },
{ name:"💳 Mã thẻ", value:mathe }
)

let row = new ActionRowBuilder().addComponents(
new ButtonBuilder()
.setCustomId(`duyet_${interaction.user.id}_${xu}`)
.setLabel("DUYỆT")
.setStyle(ButtonStyle.Success),

new ButtonBuilder()
.setCustomId(`tuchoi_${interaction.user.id}`)
.setLabel("TỪ CHỐI")
.setStyle(ButtonStyle.Danger)
)

if(channel){
await channel.send({embeds:[embed],components:[row]})
}

await interaction.editReply("✅ Thẻ đã gửi admin kiểm tra")

}

if(interaction.commandName === "shop"){

let shop = createShop(0)

interaction.reply({
embeds:[shop.embed],
components:[shop.row1,shop.row2]
})

}

}

if(interaction.isButton()){

let id = interaction.customId.split("_")

if(id[0] === "duyet"){

let userId = id[1]
let xu = Number(id[2])

let user = getUser(userId)

user.xu += xu

save()

interaction.update({
content:`✅ Đã duyệt thẻ cho <@${userId}> (+${xu} xu)`,
embeds:[],
components:[]
})

}

if(id[0] === "tuchoi"){

let userId = id[1]

interaction.update({
content:`❌ Đã từ chối thẻ của <@${userId}>`,
embeds:[],
components:[]
})

}

if(id[0] === "buy"){

let page = Number(id[1])
let index = Number(id[2])

let item = shopPages[page][index]

let user = getUser(interaction.user.id)

if(user.xu < item.price){

return interaction.reply({
content:"❌ Không đủ xu",
ephemeral:true
})

}

user.xu -= item.price

user.inventory.push(item.name)

save()

if(item.role){

let role = interaction.guild.roles.cache.get(item.role)
let member = await interaction.guild.members.fetch(interaction.user.id)

await member.roles.add(role)

}

interaction.reply(`✅ Bạn đã mua **${item.name}**`)
}

if(id[0] === "mission"){

let missionId = id[1]

let user = getUser(interaction.user.id)

resetMission(user)

if(user.mission){

return interaction.reply({
content:"❌ Bạn đang làm nhiệm vụ khác",
ephemeral:true
})

}

let mission = user.dailyMissions?.find(m=>m.id === missionId)

if(!mission){

return interaction.reply({
content:"❌ Nhiệm vụ không tồn tại",
ephemeral:true
})

}

user.mission = missionId
user.missionProgress = 0
user.missionStart = Date.now()

save()

interaction.update({
content:`📜 Bạn đã chọn nhiệm vụ **${mission.name}**`,
components:[]
})

interaction.followUp({
content:`📜 Bắt đầu nhiệm vụ **${mission.name}**\nPhần thưởng: ${mission.reward} xu`,
ephemeral:true
})

}

if(id[0] === "next"){

let page = Number(id[1])
let newPage = page+1

if(newPage >= shopPages.length) newPage = 0

let shop = createShop(newPage)

interaction.update({
embeds:[shop.embed],
components:[shop.row1,shop.row2]
})

}

if(id[0] === "prev"){

let page = Number(id[1])
let newPage = page-1

if(newPage < 0) newPage = shopPages.length-1

let shop = createShop(newPage)

interaction.update({
embeds:[shop.embed],
components:[shop.row1,shop.row2]
})

}

}

})

client.on("messageCreate",msg=>{

if(msg.author.bot) return

let user = getUser(msg.author.id)
let now = Date.now()

if(now - user.lastMessage < 3000) return

user.lastMessage = now

if(user.mission){

let mission = user.dailyMissions.find(m=>m.id === user.mission)

if(!mission) return

if(mission.type === "message"){

user.missionProgress++
msg.reply(`📊 Tiến độ: ${user.missionProgress}/${mission.goal}`)

if(user.missionProgress >= mission.goal){

user.xu += mission.reward

if(!user.missionsToday) user.missionsToday = []
user.missionsToday.push(user.mission)

msg.reply(`🎉 Hoàn thành nhiệm vụ **${mission.name}** (+${mission.reward} xu)`)

user.mission = null
user.missionProgress = 0

save()

}

}

if(mission.type === "time"){

if(Date.now() - user.missionStart >= mission.goal){

user.xu += mission.reward

user.missionsToday.push(user.mission)

msg.reply(`🎉 Hoàn thành nhiệm vụ **${mission.name}** (+${mission.reward} xu)`)

user.mission = null
user.missionProgress = 0

save()

}

}

}

})

client.once("ready", () => {
console.log(`✅ Bot online: ${client.user.tag}`)
})


client.login(process.env.TOKEN);