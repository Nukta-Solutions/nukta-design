---
"@nukta-solutions/config": patch
---

`nukta/no-hardcoded-design-values` no longer flags named group/peer variants such as
`group-data-[collapsible=icon]/sidebar:hidden`. Arbitrary values with an opacity modifier, such as
`bg-[#123]/50`, are still flagged.
