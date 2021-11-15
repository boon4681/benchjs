onmessage = async ({ data }) => {
    const code = data
    function time() {
        try {
            if (window.performance) {
                return window.performance
            } else if (performance) {
                return performance
            } else return Date
        } catch (error) {
            if (performance) {
                return performance
            } else return Date
        }
    }
    const TDistribution = [
        12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306,
        2.262, 2.228, 2.201, 2.179, 2.16, 2.145, 2.131, 2.12,
        2.11, 2.101, 2.093, 2.086, 2.08, 2.074, 2.069, 2.064,
        2.06, 2.056, 2.052, 2.048, 2.045, 2.042, 2.04, 2.037,
        2.035, 2.032, 2.03, 2.028, 2.026, 2.024, 2.023, 2.021,
        2.02, 2.018, 2.017, 2.015, 2.014, 2.013, 2.012, 2.011,
        2.01, 2.009, 2.008, 2.007, 2.006, 2.005, 2.004, 2.003,
        2.002, 2.002, 2.001, 2.39, 2.659, 2.657, 2.656, 2.655,
        2.654, 2.652, 2.651, 2.65, 2.649, 2.648, 2.647, 2.646,
        2.645, 2.644, 2.643, 2.642, 2.641, 2.64, 2.64, 2.639,
        2.638, 2.637, 2.636, 2.636, 2.635, 2.634, 2.634, 2.633,
        2.632, 2.632, 2.631, 2.63, 2.63, 2.629, 2.629, 2.628,
        2.627, 2.627, 2.626, 2.626
    ]
    const mean = function (t) {
        return t.reduce((a, b) => a + b) / t.length
    }
    const _m = async function (_i, _, code) {
        let i = _i
        let t = await eval(`(async function () { const x = _.now(); while (i--) {${code};}; return _.now() - x })`)()
        return (t > 0) ? t / _i : await _m(_i+5, _, code)
    }
    const _rme = function (sample) {
        const l = sample.length
        const df = l - 1
        const ct = (df > 30) ? 1.960 : TDistribution[df]
        const m = mean(sample)
        const o = sample.reduce((a, b) => a + Math.pow(b - m, 2), 0)
        const i = Math.sqrt(o / df) || 0
        return (i / Math.sqrt(l) * ct) / m * 100
    }
    const _ = time()
    try {
        let boon4681_benchmark_i_ = 31
        let sample = []
        while (--boon4681_benchmark_i_) {
            let _t_ = await _m(1, _, code)
            const hz = 1000 / (_t_)
            sample.push(hz)
            const rme = _rme(sample)
            postMessage({ hz, rme, sample, status: "running" })
        }
        const rme = _rme(sample)
        postMessage({ hz: mean(sample), rme, sample, status: "done" })
    } catch (error) {
        postMessage({ error })
    }
}