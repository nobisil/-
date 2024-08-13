import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllVocaLists, deleteVocaList } from '../api/vocaApi';
import '../ReactCSS/MergeCSS.css';

function WordListPage({ user }) {
    const [wordLists, setWordLists] = useState([]);
    const [showOnlyPublic, setShowOnlyPublic] = useState(false);
    const [filteredLists, setFilteredLists] = useState([]);

    useEffect(() => {
        if (user) {
            fetchWordLists();
        }
    }, [user]);

    useEffect(() => {
        // 클라이언트 사이드에서 필터링
        if (showOnlyPublic) {
            setFilteredLists(wordLists.filter(list => list.secret === 1));
        } else {
            setFilteredLists(wordLists);
        }
    }, [showOnlyPublic, wordLists]);

    const fetchWordLists = async () => {
        try {
            const lists = await getAllVocaLists();
            setWordLists(lists);
        } catch (error) {
            console.error('Failed to fetch word lists:', error);
            // 에러 처리 (예: 사용자에게 알림 표시)
        }
    };

    const handleDeleteWordList = async (id) => {
        if (window.confirm('이 단어장을 삭제하시겠습니까?')) {
            try {
                await deleteVocaList(id);
                setWordLists(wordLists.filter(list => list.id !== id));
            } catch (error) {
                console.error('Failed to delete word list:', error);
                // 에러 처리 (예: 사용자에게 알림 표시)
            }
        }
    };

    const togglePublicFilter = () => {
        setShowOnlyPublic(!showOnlyPublic);
    };

    // 디버깅을 위한 useEffect 추가
    useEffect(() => {
        console.log('WordListPage rendered');
        console.log('showOnlyPublic:', showOnlyPublic);
        console.log('filteredLists:', filteredLists);
    });

    return (
        <div className="word-list-page">
            <h2 className="page-title">단어장 목록</h2>
            <div className="filter-toggle">
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={showOnlyPublic}
                        onChange={togglePublicFilter}
                    />
                    <span className="slider round"></span>
                </label>
                <span className="toggle-label">공개 단어장만 보기</span>
            </div>
            {filteredLists.length > 0 ? (
                <div className="word-list-grid">
                    {filteredLists.map((list) => (
                        <div key={list.id} className="word-list-card">
                            <Link to={`/wordlist/${list.id}`} className="word-list-link">
                                <h3 className="word-list-title">{list.title}</h3>
                                <p className="word-count">{list.vocaContents.length} 단어</p>
                                <div className="word-preview">
                                    {list.vocaContents.slice(0, 3).map((word, index) => (
                                        <p key={index} className="preview-word">{word.text}</p>
                                    ))}
                                </div>
                            </Link>
                            <div className="card-actions">
                                <button
                                    onClick={() => handleDeleteWordList(list.id)}
                                    className="delete-button"
                                    title="단어장 삭제"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-lists-message">
                    {user
                        ? '표시할 단어장이 없습니다.'
                        : '로그인하여 단어장을 만들어보세요!'}
                </p>
            )}
            {user && (
                <div className="word-list-actions">
                    <Link to="/create-wordlist" className="create-list-button">
                        <span className="button-icon">+</span>
                        새 단어장 만들기
                    </Link>
                </div>
            )}
        </div>
    );
}

export default WordListPage;