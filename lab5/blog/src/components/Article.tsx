import {useNavigate, useParams} from 'react-router-dom';
import type ArticleData from './ArticleData.ts';
import styles from './Article.module.css';

function Article() {
    const navigate = useNavigate();

    const stringId = useParams<{ id: string }>();

    const id = parseInt(stringId.id ?? '0');

    const articles: ArticleData[] = JSON.parse(localStorage.getItem('articles') ?? '[]');
    const article: ArticleData | null = articles.find(x => x.id === id) ?? null;

    if (article == null) {
        navigate('../blog');
        return (<></>);
    }

    return (
        <div className={styles.container}>
            <article className={styles.article}>
                <h1 className={styles.title}>{article.title}</h1>
                <p className={styles.content}>{article.content}</p>
                <button
                    className={styles.backButton}
                    onClick={() => navigate('../blog')}
                >
                    ← Back to articles
                </button>
            </article>
        </div>
    );
}

export default Article;