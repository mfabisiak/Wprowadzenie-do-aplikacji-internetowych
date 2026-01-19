import {useNavigate, useParams} from 'react-router-dom';
import type ArticleData from './ArticleData.ts';

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
        <>
            <article>
                <h1>{article.title}</h1>
                <p>{article.content}</p>
            </article>
        </>
    );
}

export default Article;