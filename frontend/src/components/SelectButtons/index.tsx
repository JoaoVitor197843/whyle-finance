import styles from './SelectButtons.module.css';

type Link = {
    title: string
    url: string
}
type OpenTab = number | null;
interface Props {
    id: number;
    title: string;
    links: Link[];
    openTab: OpenTab;
    setTab: React.Dispatch<React.SetStateAction<OpenTab>>;
}

export function SelectButtons({ id, title, links, openTab, setTab}: Props) {
    const titleUpper = title.toUpperCase()
    return (
    <div className={styles.container} onMouseEnter={() => setTab(id)} onMouseLeave={() => setTab(null)}>
        <button className={styles.button} onClick={() => setTab(prev => prev === id ? null : id)} aria-expanded={openTab === id}>
            {titleUpper}
        </button>
        <ul className={`${styles.list} ${openTab === id ? styles.listOpened : ""}`}>
            {links.map(link => (
                <li  className={styles.items} key={link.title}>
                    <a className={styles.links} href={link.url}>{link.title.toUpperCase()}</a>
                </li>
            ))}
        </ul>
    </div>
    )
}