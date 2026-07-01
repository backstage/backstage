import{T as P}from"./TablePagination-XoQd841E.js";import"./iframe-ttKo4f2F.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-CK28UWWB.js";import"./index-B4b2aH3v.js";import"./Select-BUqknUMQ.js";import"./Button-ByqwGc9h.js";import"./utils-C1HatmDL.js";import"./Label-CNpe8i9L.js";import"./Hidden-B19yG0l1.js";import"./useFocusRing-DO5dfoZO.js";import"./openLink-DrXx31rJ.js";import"./useLabel-BtTJK2a0.js";import"./useLabels-BkKSc_yM.js";import"./number-BolYm4pY.js";import"./I18nProvider-CE77ZQhE.js";import"./useButton-Ca5r3393.js";import"./usePress-C-9nwvnr.js";import"./textSelection-Dxn0Zxb-.js";import"./useHover-zTEfdeKB.js";import"./FieldError-CONGBJVz.js";import"./Text-BStet0rF.js";import"./useFormValidation-DFe7ydc1.js";import"./ListBox-fBUduI9p.js";import"./useCollection-DW_ZjLWl.js";import"./keyboard-B0jD7YCN.js";import"./FocusScope-B8bFM2EB.js";import"./useEvent-CAl7p6Y1.js";import"./useControlledState-Dm95DOze.js";import"./getItemCount-8yQ549qQ.js";import"./Autocomplete-DcP3dRW8.js";import"./useLocalizedStringFormatter-CMRKakYM.js";import"./useListState-DXECVTCZ.js";import"./Dialog-Cj-H9Py4.js";import"./Heading-B4d8iVzV.js";import"./useOverlayTriggerState-RAXhowei.js";import"./VisuallyHidden-BBbZvg1N.js";import"./animation-B6X1Mob_.js";import"./useField-BC6B7UUn.js";import"./useFormReset-Dd40QI8Q.js";import"./Input-CYIbAQXq.js";import"./SearchField-BU40jX1B.js";import"./useTextField-BW7r-z_5.js";import"./useFilter-CPBh052h.js";import"./useCollectionAdapter-DlNpk-64.js";import"./Avatar-YNhfcR7w.js";import"./Skeleton-3Fu2nbdl.js";import"./FieldLabel-DYCsCA-k.js";import"./FieldError-uFmxIa-R.js";import"./Popover-5-w5Pdwm.js";import"./Text-Bfr4QZQe.js";import"./ButtonIcon-CPXGpGBf.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
