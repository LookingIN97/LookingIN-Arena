# Project Instructions

- 使用中文沟通，结论直接、具体。
- 本仓库只保存 LookingIN Arena 的公开静态站点与治理文档；比赛计算和导出实现属于相邻的 `LookingIN-Source` 仓库。
- `docs/` 是 GitHub Pages 唯一发布目录。不得提交原始构筑 PNG、完整 BuildDigest、BuildName、输入绝对路径、私有源码或发布制品。唯一允许公开的认证载荷是用户明确授权的 TOPS 分享串，只可逐字出现在所属永久榜单的可见排名行中用于复制；不得进入目录、清单或日志。新预览 PNG 不得含分享元数据；既有历史 challenge PNG 按原契约保留，不新增、不重编码。
- `docs/data/archives.json` 是唯一永久榜单清单。每个 `sN-h1/h2/h3` 只发布一次，目录为 `docs/patches/<seasonId>/`。没有 current/final 状态转换，不以 Steam Build 或标题分槽，不覆盖已有分段。历史数值目录及别名保持兼容，不强行给未知旧榜单推断 H 分段。
- 每份已发布条目及其文件哈希清单不可变，包括 HTML、图片、CSS/JS 和 executable bit。常规发布只能新增本次分段的自包含目录，并更新全量目录页和归档清单；不得修改或删除任何旧榜单/资源，不得清空整个 docs。相同批次、来源哈希和标题重试为 no-op；不同内容必须拒绝。
- 首页与 `/history/` 列出所有永久榜单；`/latest/` 仅为旧链接跳回目录，不承担“当前榜单”语义。
- 常规发布必须由 Source 的显式 Arena 发布工具生成、验证、提交并推送；不要手工拼装榜单或混用不同比赛运行的文件。仅在用户明确要求修复历史站点时才进行一次性维护，并保留 Git 来源和完整性验证证据；不重跑历史 tournament。
- 每个内聚变更单独提交。除用户明确要求外，不创建 Release、tag、ZIP 或其他部署渠道。
