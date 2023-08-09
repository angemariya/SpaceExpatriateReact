import styles from './Card.module.scss';
import { CardDefinition } from '../../card-types';
import { ResourceComponent } from '../ResourceComponent';
import {Resource} from '../../card-types'

type CardProps = CardDefinition & {} // & {}- передаем действия игрока

export const Card = (props: CardProps) => {

    return (

        <div className={`${styles[props.type]} ${styles.card}`}>
            {props.type === 'delivery' && (
                props.resources.map(el => <ResourceComponent type={el}/>)
            )}
            {props.type === 'engineering' && (
                <div className={styles[props.connection]}>
                    <div className={styles.entryPoint}>
                        {props.entryPoint && (
                            <ResourceComponent type={props.entryPoint}/>
                        )}
                    </div>
                    <div className={styles.exitPoint}>
                        {props.exitPoint.map(el =>
                             <ResourceComponent type={el}/>)}
                        {props.points && <div>{props.points}</div>}
                    </div>
                </div>
            )}
            {props.type === 'military' && (
                <div className={styles[props.weapon]}></div>
            )}
            {props.type === 'terraforming' && (
                <>
                    <div>
                        {/*props.resources.map(el => <div className={styles[el]}></div>)*/}
                        {props.resources.map(el => <ResourceComponent type={el} />)}
                        
                    </div>
                    <div>
                        {props.points}
                    </div>
                </>

            )}
        </div>
    )
}