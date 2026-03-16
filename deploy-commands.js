const { REST, Routes, SlashCommandBuilder } = require("discord.js")

const token = process.env.TOKEN;
const CLIENT_ID = "1480921738551361567"
const GUILD_ID = "1438761589791526916"

const commands = [

new SlashCommandBuilder()
.setName("shop")
.setDescription("Mở shop"),

new SlashCommandBuilder()
.setName("nhiemvu")
.setDescription("Làm nhiệm vụ"),

new SlashCommandBuilder()
.setName("daily")
.setDescription("Nhận thưởng mỗi ngày"),

new SlashCommandBuilder()
.setName("kiemtratien")
.setDescription("Xem xu"),

new SlashCommandBuilder()
.setName("inventory")
.setDescription("Xem đồ đã mua"),

new SlashCommandBuilder()
.setName("top")
.setDescription("Top giàu nhất"),

new SlashCommandBuilder()
.setName("resetxu")
.setDescription("Reset xu toàn server"),

new SlashCommandBuilder()
.setName("xoaxu")
.setDescription("Reset xu của một người")
.addUserOption(o =>
o.setName("nguoi")
.setDescription("Người cần reset")
.setRequired(true)
),

new SlashCommandBuilder()
.setName("capxu")
.setDescription("Cấp xu cho người khác")
.addUserOption(o =>
o.setName("nguoi")
.setDescription("Người nhận")
.setRequired(true))
.addIntegerOption(o =>
o.setName("soxu")
.setDescription("Số xu")
.setRequired(true)
),

new SlashCommandBuilder()
.setName("napthe")
.setDescription("Nạp thẻ cào")
.addStringOption(o =>
o.setName("loai")
.setDescription("Loại thẻ")
.setRequired(true)
.addChoices(
{name:"Viettel",value:"Viettel"},
{name:"Mobifone",value:"Mobifone"},
{name:"Vinaphone",value:"Vinaphone"}
))
.addIntegerOption(o =>
o.setName("menhgia")
.setDescription("Mệnh giá")
.setRequired(true)
.addChoices(
{name:"10000",value:10000},
{name:"20000",value:20000},
{name:"50000",value:50000},
{name:"100000",value:100000}
))
.addStringOption(o =>
o.setName("seri")
.setDescription("Số seri")
.setRequired(true))
.addStringOption(o =>
o.setName("mathe")
.setDescription("Mã thẻ")
.setRequired(true))

].map(c => c.toJSON())

const rest = new REST({ version: "10" }).setToken(TOKEN)

async function deploy(){

try{

console.log("🔄 Đang đăng ký lệnh...")

await rest.put(
Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
{ body: commands }
)

console.log("✅ Đã đăng ký lệnh")

}catch(err){
console.error(err)
}

}

deploy()