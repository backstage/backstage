import{T as P}from"./TablePagination-CFmUzQLN.js";import"./iframe-B8uJzJnC.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-B58w8bQG.js";import"./index-C3TndV9r.js";import"./Select-CJmSJeK_.js";import"./Button-9hcql9Z1.js";import"./utils-C9WtHl0n.js";import"./Label-B8rV63W8.js";import"./Hidden--CtbbQAG.js";import"./useFocusRing-uHGre-No.js";import"./openLink-BUwh7SN8.js";import"./useLabel-DuQ-sB8F.js";import"./useLabels-vvtSY4r8.js";import"./number-Cc-kUzHo.js";import"./I18nProvider-BAFWouLl.js";import"./useButton-B84fiS4B.js";import"./usePress-z5JJKJO5.js";import"./textSelection-COVkqnKL.js";import"./useHover-CGBJrmnR.js";import"./FieldError-TYXfNCFj.js";import"./Text-C2P1-Stb.js";import"./useFormValidation-t3MKasab.js";import"./ListBox-Bmbrmpsk.js";import"./useCollection-CvOYNyzq.js";import"./keyboard-DuJAq24v.js";import"./FocusScope-8F6SB8jw.js";import"./useEvent-Bv3yEJFZ.js";import"./useControlledState-Bsv8jzCO.js";import"./getItemCount-uMh6GABa.js";import"./Autocomplete-nI_kARcr.js";import"./useLocalizedStringFormatter-Cmwn2jYC.js";import"./useListState-DwWpE2UK.js";import"./Dialog-CDtLVRGJ.js";import"./Heading-BXqzHZ6g.js";import"./useOverlayTriggerState-DCu5HTgY.js";import"./VisuallyHidden-BSSg_A1m.js";import"./animation-DAXhfvHs.js";import"./useField-CUj6IoGp.js";import"./useFormReset-X4EXoTS3.js";import"./Input-fVCzcyQW.js";import"./SearchField-D1T0c6Hb.js";import"./useTextField-C0zGORas.js";import"./useFilter-XXN06l-U.js";import"./useCollectionAdapter-vS4sU3mY.js";import"./Avatar-Ct8QJQRv.js";import"./Skeleton-BhQ5GTNv.js";import"./FieldLabel-uKSbP1Kx.js";import"./FieldError-lWKBMX_q.js";import"./Popover-DanIRR7z.js";import"./Text-r9meaL2F.js";import"./ButtonIcon-DXDifQ2F.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
