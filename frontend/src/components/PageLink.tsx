import Link from "next/link"

interface PageLinkProps {
    pageLink: string,
    className: string,
    icon?: any,
    linkName?: string,
    tooltip?: string,
}


const PageLink = (props: PageLinkProps) => {

    return ( 
    <>
        <Link href={props.pageLink} className={props.className}>
            {props.linkName}
            {props.icon}
        </Link>
    </>
    )
}


export default PageLink;