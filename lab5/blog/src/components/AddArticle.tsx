import type ArticleData from './ArticleData.ts';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

function AddArticle() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const navigate = useNavigate();

    function addArticle() {
        const currentData: ArticleData[] = JSON.parse(localStorage.getItem('articles') ?? '[]');


        const id = (currentData.map(x => x.id).sort()[0] ?? 0) + 1;

        localStorage.setItem('articles', JSON.stringify([...currentData, {id, title, content}]));

        navigate('../blog');
    }

    function isDisabled() {
        return title.length < 3 || content.length < 20;
    }

    return (
        <div>
            <section>
                <label>Title:
                    <input
                        type={'text'}
                        onChange={e => setTitle(e.target.value)}
                    />
                </label>
            </section>
            <section>
                <label>Content:
                    <textarea
                        onChange={e => setContent(e.target.value)}
                    />
                </label>
            </section>
            <button disabled={isDisabled()} onClick={addArticle}>Add article</button>
        </div>
    );
}

export default AddArticle;