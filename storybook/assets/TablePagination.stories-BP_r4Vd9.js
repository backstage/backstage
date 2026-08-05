import{T as P}from"./TablePagination-E6mBlZt0.js";import"./iframe-BSg6SOip.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-DBlAjOUP.js";import"./index-Dlj3HaWF.js";import"./Select-D8yWE-v_.js";import"./Button-OzTainv7.js";import"./utils-DeLUZGx2.js";import"./Label-Bsgi-8sx.js";import"./Hidden-4PpluWSp.js";import"./useFocusRing-DGKZUDqT.js";import"./openLink-DxYjWf7G.js";import"./useLabel-xLEOMe10.js";import"./useLabels-C_VR0tdY.js";import"./number-iU0vIrtR.js";import"./I18nProvider-C5Ed87oL.js";import"./useButton-BIeTy3DX.js";import"./usePress-DhUqF1zw.js";import"./textSelection-aDFvxn9c.js";import"./useHover-BKKglU9f.js";import"./FieldError-BlC4M7Iq.js";import"./Text-sM1EKRDW.js";import"./useFormValidation-ChfEGaAs.js";import"./ListBox-VuPp4ZDp.js";import"./useCollection-DvHDK50b.js";import"./keyboard-CsWowfPP.js";import"./FocusScope-Cokg97zJ.js";import"./useEvent-wFo09GKu.js";import"./useControlledState-CaozfHK9.js";import"./getItemCount-DKo1Nidv.js";import"./Autocomplete-CnJA6POS.js";import"./useLocalizedStringFormatter-3P7dKLk3.js";import"./useListState-CTPsqM3T.js";import"./Dialog-g4w5QBOm.js";import"./Heading-CRk9HMj5.js";import"./useOverlayTriggerState-BjxIi2GR.js";import"./VisuallyHidden-NMydw6nU.js";import"./animation-C65meOdJ.js";import"./useField-CXk8tlI8.js";import"./useFormReset-D0dwzMqm.js";import"./Input-DH05hXmi.js";import"./SearchField-BDXMhnez.js";import"./useTextField-unZ9EnYz.js";import"./useFilter-DzFFH65V.js";import"./useCollectionAdapter-DaClkSlp.js";import"./Avatar-CCYGbNbZ.js";import"./Skeleton-CSDLwpsp.js";import"./FieldLabel-CYUQVtSh.js";import"./FieldError-_FYShYXS.js";import"./Popover-B0K_J-36.js";import"./Text-BUrmjhwZ.js";import"./ButtonIcon-BZq12D5a.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
