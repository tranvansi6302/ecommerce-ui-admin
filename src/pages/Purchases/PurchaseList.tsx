import { Link } from 'react-router-dom'
import MyButton from '~/components/MyButton'
import PATH from '~/constants/path'

export default function PurchaseList() {
    return (
        <Link to={PATH.PURCHASE_CREATE} className=''>
            <MyButton>Tạo đơn nhập hàng</MyButton>
        </Link>
    )
}
