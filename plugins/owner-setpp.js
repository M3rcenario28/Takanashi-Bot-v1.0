
let handler = async (m, { conn, isOwner }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!/image\/(png|jpe?g)/.test(mime)) return m.reply('Responde a una imagen para cambiar la foto de perfil del bot.')
    let img = await q.download()
    if (!img) return m.reply('No se pudo descargar la imagen.')
    await conn.updateProfilePicture(conn.user.jid, img)
    m.reply('¡Foto de perfil actualizada con éxito!')
}
handler.help = ['setppbot']
handler.tags = ['owner']
handler.command = /^setpp(bot)?$/i
handler.rowner = true

export default handler