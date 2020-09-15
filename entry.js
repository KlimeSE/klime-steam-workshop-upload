const process = require('process')
const fs = require('fs')
const child_process = require('child_process')

const REQUIRED_ENV = ['STEAM_USERNAME', 'STEAM_PASSWORD', 'INPUT_APPID', 'INPUT_ITEMID', 'INPUT_PATH',]

for (const env in REQUIRED_ENV) {
    if (!process.env[REQUIRED_ENV[env]]) {
        console.log(`Environment variable ${REQUIRED_ENV[env]} is required but not provided.`)
        process.exit(1)
    }
}

const WORKSHOPVDF = `
"workshopitem"
{
    "appid" "${process.env.INPUT_APPID}"
    "publishedfileid" "${process.env.INPUT_ITEMID}"
    "contentfolder"    "${process.env.repo}/${process.env.INPUT_PATH}"
    "changenote" "${process.env.INPUT_CHANGENOTE}"
}
`

fs.writeFileSync('/home/steam/workshop.vdf', WORKSHOPVDF)

if (process.env.STEAM_TFASEED) {
    let args = `-username ${process.env.STEAM_USERNAME} -password ${process.env.STEAM_PASSWORD} -seed ${process.env.STEAM_TFASEED} -args "+workshop_build_item /home/steam/workshop.vdf +quit"`
    child_process.spawnSync('/home/steam/steamcmd-2fa', args.split(" "),
    {
        stdio: 'inherit',
        timeout: 60000,
        shell: true
    })
} else {
    let args = `+login ${process.env.STEAM_USERNAME} ${process.env.STEAM_PASSWORD} +workshop_build_item /home/steam/workshop.vdf +quit`
    child_process.spawnSync('/home/steam/steamcmd/steamcmd.sh', args.split(" "),
    {
        stdio: 'inherit',
        timeout: 60000,
        shell: true
    })
}

const stdErr = fs.readFileSync('/home/steam/Steam/logs/stderr.txt', 'utf8')
console.log('STDERR: ', stdErr)

