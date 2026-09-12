import{T as P}from"./TablePagination-C0NrC3ym.js";import"./iframe-CLUDVQ5J.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-CQXTcWYX.js";import"./index-CCFrD1rS.js";import"./Select-aisWp8KM.js";import"./Button-BmqzM9an.js";import"./utils-CdHRLi7C.js";import"./Label-CNIOxAyj.js";import"./Hidden-DkhqOV0y.js";import"./useFocusRing-Cx5cCMJc.js";import"./openLink-lG-tuZVC.js";import"./useLabel-CjwBUe0X.js";import"./useLabels-q6j7b-So.js";import"./number-CoCtNFQ5.js";import"./I18nProvider-s5nF7SKo.js";import"./useButton-D_vL7KO0.js";import"./usePress-jgC8cslr.js";import"./textSelection-BVXh5k5C.js";import"./useHover-DTy99tks.js";import"./FieldError-DaJxDAqj.js";import"./Text-DDdAhRnT.js";import"./useFormValidation-CBERPyny.js";import"./ListBox-CUBe8M4g.js";import"./useCollection-RmlFSKrL.js";import"./keyboard-CTVKKV84.js";import"./FocusScope-BhVVZnlr.js";import"./useEvent-BvcA7h7K.js";import"./useControlledState-CzVtswPQ.js";import"./getItemCount-K3ShNJW4.js";import"./Autocomplete-Dtbkf9kY.js";import"./useLocalizedStringFormatter-BScKml51.js";import"./useListState-CNd9LeDF.js";import"./Dialog-III0Ly0I.js";import"./Heading-BgKbRHoo.js";import"./useOverlayTriggerState-CQGaE1Jp.js";import"./VisuallyHidden-D4y4EBqD.js";import"./animation-o_HaFoft.js";import"./useField-D-2OJaRj.js";import"./useFormReset-H3vuwfeO.js";import"./Input-B1aj2MuM.js";import"./SearchField-BkCVi9Cs.js";import"./useTextField-gz8a5pLp.js";import"./useFilter-BlwBeS82.js";import"./useCollectionAdapter-DI9IyhER.js";import"./Avatar-DEgUsAM8.js";import"./Skeleton-DTavyKN2.js";import"./FieldLabel-oSV1lcfS.js";import"./FieldError-CZ7BSG0h.js";import"./Popover-uwH1CShj.js";import"./Text-BZ_kiMyv.js";import"./ButtonIcon-oVA306rU.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
