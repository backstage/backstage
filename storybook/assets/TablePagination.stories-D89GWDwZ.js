import{T as P}from"./TablePagination-DDAAM7cm.js";import"./iframe-Bbqeoxyy.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-Cou_yZVk.js";import"./index-CWg0XmG9.js";import"./Select-BUI28kmx.js";import"./Button-DBxI9neY.js";import"./utils-DuG_PdhV.js";import"./Label-BYZanQTo.js";import"./Hidden-wfkm4vEc.js";import"./useFocusRing-CJyvvUb2.js";import"./openLink-DSranXhD.js";import"./useLabel-CueqYSAw.js";import"./useLabels-CD6Jijpq.js";import"./number-B0As9b-E.js";import"./I18nProvider-o7BfuMCW.js";import"./useButton-CP9W9vY-.js";import"./usePress-DupziYu-.js";import"./textSelection-CSZvk6XP.js";import"./useHover-8JiRj4U9.js";import"./FieldError-BDQ8zAVN.js";import"./Text-Cr5ym0oi.js";import"./useFormValidation-Cw1sohsz.js";import"./ListBox-Yv13f5-s.js";import"./useCollection--fJtGRLb.js";import"./keyboard-OW3LSnFF.js";import"./FocusScope-BLvIp10Q.js";import"./useEvent-DXCHZ6eW.js";import"./useControlledState-Dwmvm7Z8.js";import"./getItemCount-CqqnBPvL.js";import"./Autocomplete-DejFa75s.js";import"./useLocalizedStringFormatter-Cp3K2lsu.js";import"./useListState-DXn2kpOz.js";import"./Dialog-BbliGjQD.js";import"./Heading-B9aI8xvX.js";import"./useOverlayTriggerState-WXzfO5cP.js";import"./VisuallyHidden-BOk9nD-m.js";import"./animation-UzooCWZq.js";import"./useField-eNfnIoXm.js";import"./useFormReset-JrSj1kIr.js";import"./Input-nC1ndIv_.js";import"./SearchField-CWgaa0Wk.js";import"./useTextField-WT6ToGrz.js";import"./useFilter-6_lgTKlj.js";import"./useCollectionAdapter-D4sYsXzb.js";import"./Avatar-Ce7sJMjp.js";import"./Skeleton-E2nILiWh.js";import"./FieldLabel-BoyRNiAc.js";import"./FieldError-DbMuQ36F.js";import"./Popover-B-bONdAv.js";import"./Text-BlehBH3s.js";import"./ButtonIcon-bZXMNDvR.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    offset: 0,
    pageSize: 10,
    totalCount: 100,
    hasNextPage: true,
    hasPreviousPage: false,
    onNextPage: noop,
    onPreviousPage: noop,
    onPageSizeChange: noop,
    showPageSizeOptions: true
  }
}`,...e.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  }
}`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 90,
    hasNextPage: false,
    hasPreviousPage: true
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 40,
    hasPreviousPage: true
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    showPageSizeOptions: false
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: undefined
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 20,
    hasPreviousPage: true,
    getLabel: ({
      offset,
      pageSize,
      totalCount
    }) => {
      const page = Math.floor((offset ?? 0) / pageSize) + 1;
      const totalPages = Math.ceil((totalCount ?? 0) / pageSize);
      return \`Page \${page} of \${totalPages}\`;
    }
  }
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    totalCount: 0,
    hasNextPage: false
  }
}`,...i.parameters?.docs?.source}}};const Pe=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,o as FirstPage,a as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,Pe as __namedExportsOrder,le as default};
