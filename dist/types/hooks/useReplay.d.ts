declare const useReplay: () => {
    active: boolean;
    replayEndEvent: string | undefined;
    replayStartEvent: string | undefined;
    isReplay: boolean | undefined;
};
export default useReplay;
