import{T as P}from"./TablePagination-VNJmiShy.js";import"./iframe-CJeP2vvm.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-C-2dJx3K.js";import"./index-DyrFOjzE.js";import"./Select-D8TVPpBh.js";import"./Button-BDYf5QxC.js";import"./utils-Ci9aOot6.js";import"./Label-D4bUC6Na.js";import"./Hidden-BDNd3cL9.js";import"./useFocusRing-o6_0h1DB.js";import"./openLink-Dw-jVqrV.js";import"./useLabel-CmJz89mn.js";import"./useLabels-DRlool0j.js";import"./number-BSFxjcvW.js";import"./I18nProvider-C7P3l0dN.js";import"./useButton-DUAdcx1U.js";import"./usePress-BBcvFLiN.js";import"./textSelection-C5htZZfI.js";import"./useHover-Bg3BX-Db.js";import"./FieldError-BkU6JVez.js";import"./Text-BA3ToQdd.js";import"./useFormValidation-CBxiIw6I.js";import"./ListBox-CKRVhzwU.js";import"./useCollection-DC2dMXw2.js";import"./keyboard-C_4fFDAk.js";import"./FocusScope-CrvxcrnB.js";import"./useEvent-BeGsBTLg.js";import"./useControlledState-CqCclfwn.js";import"./getItemCount-CQducLSl.js";import"./Autocomplete-Diq8wjE-.js";import"./useLocalizedStringFormatter-r6ayiQJa.js";import"./useListState-0lDpe9Bc.js";import"./Dialog-b1MBRoD8.js";import"./Heading-CnACen_l.js";import"./useOverlayTriggerState-Drctaywp.js";import"./VisuallyHidden-CZOHUozB.js";import"./animation-CvMuFemQ.js";import"./useField-CAcKkVb1.js";import"./useFormReset-D_rWU48j.js";import"./Input-Bc46tetu.js";import"./SearchField-szVf4cR5.js";import"./useTextField-l2U9Rhdp.js";import"./useFilter-Bmm0OXbb.js";import"./useCollectionAdapter-BbG-870D.js";import"./Avatar-Cqj8zu6b.js";import"./Skeleton-DnCeyy-U.js";import"./FieldLabel-D0xJzGcQ.js";import"./FieldError-pmuFbcaX.js";import"./Popover-DK1TIZrv.js";import"./Text-CPKESXCj.js";import"./ButtonIcon-DHwAGLxp.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
