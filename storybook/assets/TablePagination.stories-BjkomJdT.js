import{T as P}from"./TablePagination-BOGDJE4k.js";import"./iframe-Bkld27Xv.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-hOSdhRq8.js";import"./index--5rDCIj_.js";import"./Select-Ppd60V0H.js";import"./Button-Dq2R9N9l.js";import"./utils-DEGlt2_H.js";import"./Label-CzzbJTkN.js";import"./Hidden-CJz8ByQd.js";import"./useFocusRing-Sg8Yc6Zc.js";import"./openLink-Dls5t0TL.js";import"./useLabel-D1T8LrYx.js";import"./useLabels-DgACLhvG.js";import"./number-CQltgpBt.js";import"./I18nProvider-CcjFgoxB.js";import"./useButton-CPwh7t0a.js";import"./usePress-Bi6q7Yb-.js";import"./textSelection-BI78VxK7.js";import"./useHover-BTVKyR5u.js";import"./FieldError-BS9yiOWv.js";import"./Text-BUEI6kbu.js";import"./useFormValidation-CUV93Bjh.js";import"./ListBox-SYkX1TLX.js";import"./useCollection-hBU3paJt.js";import"./keyboard-CjcwyYqU.js";import"./FocusScope-Ce-2AlIY.js";import"./useEvent-CEECt1ZX.js";import"./useControlledState-BDm5gUq3.js";import"./getItemCount-Bw7kkJMr.js";import"./Autocomplete-3KAQwcNc.js";import"./useLocalizedStringFormatter-CyMRJiUd.js";import"./useListState-BUBg_-f7.js";import"./Dialog-DktLIxy9.js";import"./Heading-BOjVGDqS.js";import"./useOverlayTriggerState-D0ayscvr.js";import"./VisuallyHidden-zbwA2tPm.js";import"./animation-CJ47w7Fx.js";import"./useField-8zpTTKWi.js";import"./useFormReset-CvfhEzlX.js";import"./Input-CV-w3vcP.js";import"./SearchField-ED0xzAc5.js";import"./useTextField-Bxio2Baz.js";import"./useFilter-DAeJJSUh.js";import"./useCollectionAdapter-BvRl77Kr.js";import"./Avatar-pjHbkAX1.js";import"./Skeleton-B6C8sZpy.js";import"./FieldLabel-BuRmQ-ql.js";import"./FieldError-D9M9uQR1.js";import"./Popover-C2ykmP-G.js";import"./Text-DqAiXx4f.js";import"./ButtonIcon-BmtQzhOx.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
