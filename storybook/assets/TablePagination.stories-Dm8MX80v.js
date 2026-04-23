import{T as P}from"./TablePagination-umZ-UIk7.js";import"./iframe-CsCfxPn_.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-BxfOcqJ5.js";import"./index-BKt9zum2.js";import"./Select-CowcDnPg.js";import"./Dialog-Sz24-WR-.js";import"./Button-pU6Owdb9.js";import"./utils-DvgauPIn.js";import"./Label-Hg0cB6oT.js";import"./Hidden-DJH4Ilgv.js";import"./useGlobalListeners-CpcV6s3I.js";import"./openLink-BrP_7GAS.js";import"./useLabel-BvfmTbEA.js";import"./useLabels-WrXMeIyK.js";import"./number-CuOAqyVQ.js";import"./I18nProvider-BENFC-9w.js";import"./useButton-CJs9Ljhi.js";import"./usePress-uzoVp1uP.js";import"./textSelection-CPUOakXR.js";import"./useHover-BQ1b8sFg.js";import"./Heading-OGzQR_kx.js";import"./useOverlayTriggerState-BaKaQtSn.js";import"./useControlledState-DnnRo852.js";import"./useCollection-6vdc7J7q.js";import"./keyboard-BprMhHK9.js";import"./FocusScope-CQv_xJYu.js";import"./useEvent-CFqEXxMT.js";import"./Autocomplete-Cv1VwB81.js";import"./useLocalizedStringFormatter-CnHWyO0_.js";import"./getItemCount-BM0f6IzP.js";import"./Text-BUxkZD4S.js";import"./VisuallyHidden-BxEns4sJ.js";import"./animation-DJKZC1DN.js";import"./FieldError-DJPjJZjM.js";import"./useFormValidation-CbGwD0tJ.js";import"./ListBox-B4XedE_g.js";import"./useListState-BrcIr7mo.js";import"./useField-D1Yteliv.js";import"./useFormReset-CmlsYa4s.js";import"./definition-5tBdgQx8.js";import"./Input-CnzuwThE.js";import"./SearchField-DdsD6HHj.js";import"./useTextField-BtzsUAKL.js";import"./useFilter-BTwAjcNr.js";import"./FieldLabel-j6HdK9VK.js";import"./FieldError-BKc5kgMW.js";import"./Text-DNRUl0Ae.js";import"./ButtonIcon-DsQGw-ed.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const ce=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,o as FirstPage,a as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,ce as __namedExportsOrder,me as default};
