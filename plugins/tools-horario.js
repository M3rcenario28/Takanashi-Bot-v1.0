import moment from 'moment-timezone'

let handler = async (m, { conn }) => {
    let tz1 = moment().tz('America/Mexico_City').format('HH:mm:ss DD/MM/YYYY')
    let tz2 = moment().tz('America/Bogota').format('HH:mm:ss DD/MM/YYYY')
    let tz3 = moment().tz('America/Buenos_Aires').format('HH:mm:ss DD/MM/YYYY')
    let tz4 = moment().tz('Europe/Madrid').format('HH:mm:ss DD/MM/YYYY')

    let caption = `
⏰ *HORARIOS ACTUALES*

🇲🇽 *México (CDMX):* ${tz1}
🇨🇴 *Colombia / Perú / Ecuador:* ${tz2}
🇦🇷 *Argentina / Chile:* ${tz3}
🇪🇸 *España:* ${tz4}
`.trim()

    m.reply(caption)
}
handler.help = ['horario']
handler.tags = ['tools']
handler.command = /^(horario|time|hora)$/i

export default handler