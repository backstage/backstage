import{T as P}from"./TablePagination-DBo5Q0po.js";import"./iframe-CNmrqhdp.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-BygjGZ_P.js";import"./index-jGGcolGj.js";import"./Select-CiJLzbku.js";import"./Button-ByrcHOij.js";import"./utils-Sr-NPl0z.js";import"./Label-Cb4DfX2Z.js";import"./Hidden-DONWTan9.js";import"./useFocusRing-B36xO6ag.js";import"./openLink-Dcd4pMbN.js";import"./useLabel-CfM79w8Z.js";import"./useLabels-BTxW8teZ.js";import"./number-ug0gep35.js";import"./I18nProvider-PoM4EcNd.js";import"./useButton-BvWRt6oq.js";import"./usePress-DDoI5Xm_.js";import"./textSelection-CXpt_i3y.js";import"./useHover-BZGog5A_.js";import"./FieldError-BAmg5VBk.js";import"./Text-DIH2iR11.js";import"./useFormValidation-DdWPpMBa.js";import"./ListBox-D76cg46A.js";import"./useCollection-DMCOSpRG.js";import"./keyboard-Dvuv5R5W.js";import"./FocusScope-CLkZ64N_.js";import"./useEvent-BD_f3oxO.js";import"./useControlledState-CpemmCIy.js";import"./getItemCount-BFsEtoVD.js";import"./Autocomplete-CjUj2z_u.js";import"./useLocalizedStringFormatter-ByMVNtY0.js";import"./useListState-6BffKtHc.js";import"./Dialog-BLqs_OeM.js";import"./Heading-Bg92Si_z.js";import"./useOverlayTriggerState-B8nVZ5c8.js";import"./VisuallyHidden-Cuwe1Ube.js";import"./animation-Efp1_2Al.js";import"./useField-DtngLnl2.js";import"./useFormReset-D--OHsSZ.js";import"./Input-Dpe8d9Rx.js";import"./SearchField-0vsaZtrR.js";import"./useTextField-Bcbq09TS.js";import"./useFilter-Bw-X1Sf8.js";import"./useCollectionAdapter-Dnm6kh2N.js";import"./Avatar-BASbk_Am.js";import"./Skeleton-BErqWrCY.js";import"./FieldLabel-BOuBB-Qc.js";import"./FieldError-B4s9FQNG.js";import"./Popover-h89TZJ7l.js";import"./Text-D7i8beMO.js";import"./ButtonIcon-DcW9pldC.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
