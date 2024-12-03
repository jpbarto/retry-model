# Measurements

> Note: All target values below are specific to an individual system.

**SLO Attainment**

A service level documents the ideal performance of a system from the perspective of the business. 

For example:
`The system will process 99.99% of events in a 24 hour period successfully within 120 seconds of receipt.`

`SLO Attainment` documents whether the system is currently performing at, below, or above its specified service level. As a service level indicates whether the system is meeting its business purpose attainment of service level objectives is the overarching and most important measurement. Performing above SLO can be beneficial as it can offset times when SLOs are not being met but achieving in excess of SLO by too much (perhaps 2 standard deviations) can be an indication of waste, where the system is over-performing. Obviously performing below service levels is also undesirable as it indicates the system is not meeting its business purpose.

SLO attainment is the most important indicator of whether a system is meeting its business purpose.

Target value: Above SLO by 1 standard deviation

**Lead time for change**

`Lead time for change` measures the time from creation of a backlog item to delivery of that item into production. This utlimately measures how quickly a system is able to respond to changes in its requirements or environment. A low lead time will improve feedback loops with developers, where they can hold in their mind the need for a change, implement it, and begin to realize the benefits of that change. A high lead time will cause developer fatigue and a lack of personal investment by developers in their changes. Equally a high lead time will mean that a system will remain susceptible to previous scenarios that caused business loss, increasing risk to the business.

Target value: 1 week

**Deployment frequency**

`Deployment frequency` measures how frequently a system is updated in production. This measurement is an indication of how frequently a system is changing in production and measures how adaptable the system is to changes in its purpose or environment. A high deployment frequency indicates a healthy automation system for deployments and will contribute to a low `Lead time for change`. A low deployment frequency will likely cause a buildup of completed, tested backlog items waiting to go out and / or will result in deployments that include a high number of changes (increasing change complexity). 

Target value: 1 per day

**Mean time between failure**

`MTBF` measures the time between incidents where an incident is defined as any time when a system stops meeting its service level objectives. A high MTBF reflects a high level of attainment of service levels while a low MTBF indicates an application which is fragile or sensitive to changes in its environment or usage. A low MTBF should receive engagement to increase its preventative resilience controls.

Target value: 90 days

**Mean time to Detect (MTTD)**

`MTTD` measures the time between when an impact occurs and when an alarm is triggered. This does not measure the time from when an event occurred and the time to detect as events can be difficult to pinpoint, may occurr in conjunction with other events (or even bugs that were written 4 years ago), or may have occurred before without impact. While this is important we want to know how effective our alarms are at sensing impact, ideally predicting it (a negative mean time to detect). Ideally MTTD is near zero. A high MTTD will mean that customers are impacted for a period before operators can get engaged and fix the system. A negative MTTD, if too large, will likely correlate with false positive notification, leading to operator fatigue and becoming desensitized to alarms.

Target value: 30 seconds

## Measurements by Category
| Anticipate | Detect | Respond | Learn |
|------------|--------|---------|-------|
| MTBF | MTTD | MTTResp | None |