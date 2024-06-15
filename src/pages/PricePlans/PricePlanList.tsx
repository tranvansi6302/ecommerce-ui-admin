import { Link } from 'react-router-dom'
import MyButton from '~/components/MyButton'
import PATH from '~/constants/path'
import useSetTitle from '~/hooks/useSetTitle'

export default function PricePlanList() {
    useSetTitle('Phương án giá')
    return (
        <div>
            <Link to={PATH.PRICE_PLAN_LIST_CREATE}>
                <MyButton severity='success' size='large'>
                    Do Bach Ngoc
                </MyButton>
            </Link>
        </div>
    )
}
