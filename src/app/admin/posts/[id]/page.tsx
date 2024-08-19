'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Category } from '@/app/_types/Category'
import { Post } from '@/app/_types/Post'
import Categories from '../../categories/page'
import { PostCategory } from '@prisma/client'

const PostPage = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const { id } = useParams()
  const router = useRouter()
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    //記事更新
    await fetch(`/api/admin/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ title, content, thumbnailUrl, categories: selectedCategories }),
    })
    alert('記事を更新しました。')
    router.push('/admin/posts')
  }

  //記事削除
  const handleDeletePost = async () => {
    if (!confirm('記事を削除しますか？')) return
    await fetch(`/api/admin/posts/${id}`, {
      method: 'DELETE',
    })
    alert('記事を削除しました。')
    router.push('/admin/posts')
  }

  //記事を取得
  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`/api/admin/posts/${id}`)
      // const data = await res.json();
      // console.log(data);

      const { post } = await res.json()
      setTitle(post.title)
      setContent(post.content)
      setThumbnailUrl(post.thumbnailUrl)
      // これは何をしていたか？
      const postCategoris = post.postCategories
      const categories: Category[] = postCategoris.map(
        (postCategory: { category: Category }) => postCategory.category,
      )
      setSelectedCategories(categories)
    }
    fetcher()
  }, [id])

  //カテゴリーを取得
  //  useEffect(()=>{});
  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch('/api/admin/categories')
      const { categories }: { categories: Category[] } = await res.json()
      setCategories(categories)
    }
    fetcher()
  }, [])

  // const handleSelectCategory = (category: Category) => {
  //   setSelectedCategories([...selectedCategories, category]);
  // };
  // console.log(selectedCategories);

  const handleSelectCategory = (category: Category) => {
    const selectedCategoryIds = selectedCategories.map((c) => c.id)
    const isSelected = selectedCategoryIds.includes(category.id)
    if (isSelected) {
      setSelectedCategories(
        selectedCategories.filter((c) => c.id !== category.id),
      )
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  return (
    <main className="w-4/5 mx-auto">
      <div>
        <h1 className="font-bold text-xl p-4 my-4">記事更新</h1>
      </div>
      <form onSubmit={handlePostSubmit} className="w-5/6 mx-auto">
        <div>
          <label
            htmlFor="title"
            className="mt-4 block w-24 text-sm font-medium text-gray-700"
          >
            タイトル名
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-4 block w-5/6 min-w-40 rounded-md border border-gray-200 p-3"
          />
        </div>
        <div>
          <label
            htmlFor="content"
            className="mt-4 block w-24 text-sm font-medium text-gray-700"
          >
            内容
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-4 block w-5/6 min-w-40 h-22 rounded-md border border-gray-200 p-3"
          />
        </div>
        <div>
          <label
            htmlFor="thumbnailUrl"
            className="mt-4 block w-32 text-sm font-medium text-gray-700"
          >
            サムネイルURL
          </label>
          <input
            type="text"
            id="thumbnailUrl"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className="mt-4 block w-5/6 min-w-40 rounded-md border border-gray-200 p-3"
          />
        </div>

        {/* //カテゴリー */}
        <div>
          <label
            htmlFor="categories"
            className="mt-4 block w-24 text-sm font-medium text-gray-700"
          >
            カテゴリー
          </label>
          {categories.map((category) => {
            const isSelected = selectedCategories
              //selectedCategories配列の中の一つのid
              .map((c) => c.id)
              //さらにcategory.idが含まれているもの
              .includes(category.id)
            return (
              <div
                key={category.id}
                onClick={() => handleSelectCategory(category)}
                className={`${
                  isSelected ? 'bg-blue-500' : ''
                } border border-blue-500 w-fit p-1 rounded-md text-sm`}
              >
                {category.name}
              </div>
            )
          })}
        </div>
        <button
          type="submit"
          className="mt-4 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          更新
        </button>
        <button
          onClick={handleDeletePost}
          type="button"
          className="mt-4 ml-4 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          削除
        </button>
      </form>
    </main>
  )
}

export default PostPage
