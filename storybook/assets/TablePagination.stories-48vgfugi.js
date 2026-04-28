import{T as P}from"./TablePagination-7m57GxPr.js";import"./iframe-Tg-tOL7r.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-C0UJtPdT.js";import"./index-DC42sjLZ.js";import"./Select-oHYocW6V.js";import"./Dialog-8jJnXnw2.js";import"./Button-CjJkQHMT.js";import"./utils-BF6W4cub.js";import"./Label-BcsY5LI4.js";import"./Hidden-D5WrUlh8.js";import"./useGlobalListeners-kY5XWfJh.js";import"./openLink-D0gPIJFP.js";import"./useLabel-SnxCYsm1.js";import"./useLabels-Co5JooNE.js";import"./number-jegR8xAw.js";import"./I18nProvider-D9-KlzuW.js";import"./useButton-BiyDQVpK.js";import"./usePress-BX6RnTnk.js";import"./textSelection-3m4Ttnyw.js";import"./useHover-CWLhQr9S.js";import"./Heading-CvgEERI7.js";import"./useOverlayTriggerState-BHzdN69Q.js";import"./useControlledState-DdnZMUzW.js";import"./useCollection-CbuHUcMu.js";import"./keyboard-Yjx4F_O7.js";import"./FocusScope-Cy-0NI6R.js";import"./useEvent-DTez4NK5.js";import"./Autocomplete-BZrobcQU.js";import"./useLocalizedStringFormatter-Bmgx8Odd.js";import"./getItemCount-CDrjmKre.js";import"./Text-Cu9crGAR.js";import"./VisuallyHidden-B4rOjE2l.js";import"./animation-DorIHj0r.js";import"./FieldError-CpaBCtW2.js";import"./useFormValidation-k6uecrX0.js";import"./ListBox-B53RXj5t.js";import"./useListState-Uv8enifO.js";import"./useField-B40w601G.js";import"./useFormReset-BokVD26T.js";import"./definition-Hfl1cypg.js";import"./Input-CMLuY8KX.js";import"./SearchField-AmvabGdX.js";import"./useTextField-DqXrvOAx.js";import"./useFilter-dbsQIdiU.js";import"./FieldLabel-DC4aDQrc.js";import"./FieldError-CUdFfKdT.js";import"./Text-BHzcUmzn.js";import"./ButtonIcon-BJsjP8E3.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
