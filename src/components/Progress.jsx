export default function Progress({text, percentage}) {
    percentage = percentage ?? 0;
    return (
        <div className='progress'>
            <div className='progress-bar' style={{width: `${percentage}%`}}></div>
            <div className='progress-text'>{text} ({`${percentage.toFixed(2)}%`})</div>
        </div>
    )
}