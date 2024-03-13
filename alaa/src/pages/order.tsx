import { Header } from '@/components/header'
import { useParams } from 'react-router-dom'

export const OrderPage = () => {
  const { id } = useParams()

  return (
    <>
      <Header />
      <div>order - {id}</div>
    </>
  )
}
