// render初始化第一个任务，下一个任务单元
let nextUnitOfWork: any = null

function workLoop(deadline: any) {
  // 有下一个任务，并且浏览器剩余时间 > 1毫秒
  while(nextUnitOfWork && deadline.timeRemaining() > 1) {
    nextUnitOfWork = performanceUnitOfWork(nextUnitOfWork)
  }
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

// 执行玩完当前任务之后，要返回下一个单元任务
function performanceUnitOfWork(fiber: any) {
  
}
