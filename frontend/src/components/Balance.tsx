type BalanceProps = {
    value: number;
    loading?: boolean;
}

export const Balance = ({ value, loading }: BalanceProps) => {
    return (
        <div className="flex">
            <div className="font-bold text-lg">
                Your balance
            </div>
            <div className="font-semibold ml-4 text-lg">
                {loading ? "Loading..." : `Rs ${value.toFixed(2)}`}
            </div>
        </div>
    );
}