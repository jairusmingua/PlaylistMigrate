const prisma = require('@prisma/client')

async function main() {
    const prefix = 'matchPaylistOrigins'
    const client = new prisma.PrismaClient()
    console.log(`Starting Script: ${prefix}`)
    const migratedSongs = await client.playlist.findMany({
        where: {
            description: {
                startsWith: 'This is migrated playlist from'
            }
        }
    })
    const results = []
    for (let i = 0; i < migratedSongs.length; i++) {
        const _playlist = await client.playlist.findFirst({
            where: {
                title: migratedSongs[i].title,
                description: {
                    not: {
                        startsWith: 'This is migrated playlist from'
                    }
                }
            }
        })
        if (_playlist) {
            const _result = await client.playlist.update({
                where: {
                    id: migratedSongs[i].id
                },
                data: {
                    playlistId: _playlist.id
                }
            })
            results.push(_result)
        }
    }
    console.log(`Updated ${results.length} Playlist`)
}
main().then(() => {
    console.log('Done!')
    process.exit()
})