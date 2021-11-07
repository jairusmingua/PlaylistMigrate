export function Footer() {
    return <> <footer className="p-3 page-footer font-small">
        <div className="text-center pb-2">
            © 2021 Copyright:
            <a href={process.env.BASE_URL}>&nbsp;PlaylistMigrate</a>
        </div>
        <div className="text-center">
            Developed and Designed by: <a target="_blank" href="https://jairusmingua.xyz">&nbsp;Jairus Mingua</a>
        </div>
        <style jsx>{
        `
            footer{
                color: black;
                background-color: white;
            }
        `
        }
        </style>
    </footer></>
}

