import { GetStaticProps } from "next"
import { api } from "../services/api"

//? interface works the same aswell
// First way to type the props
type Episode = {
  id: string;
  title: string;
  members: string;
}

type HomeProps = {
  episodes: Episode[];
}

// Second way to type the props
/*
type HomeProps = {
  episodes: Array<{
    id: string;
    title: string;
    members: string;
  }>
}
*/

export default function Home(props : HomeProps) {
  return <p>{JSON.stringify(props.episodes)}</p>
}

export const getStaticProps : GetStaticProps = async () => {
  const response = await api.get('/episodes?_limit=12&_sort=published_at&_order=desc')
  const data = await response.json()

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8 // 
  }
}