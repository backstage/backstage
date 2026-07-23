import{T as P}from"./TablePagination-9nsZFSWK.js";import"./iframe-DEB_XKCy.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-Ctp5tGlo.js";import"./index-BI-bQJz8.js";import"./Select-CafL0w8z.js";import"./Button-CD6RS4NW.js";import"./utils-CrlF93yQ.js";import"./Label-CunX4hTS.js";import"./Hidden-Bcf80zYT.js";import"./useFocusRing-DOwaR7bd.js";import"./openLink-D4lCVjTw.js";import"./useLabel-CTUJJsAz.js";import"./useLabels-BcoDEarN.js";import"./number-DUI_xCBM.js";import"./I18nProvider-BHXvn5NR.js";import"./useButton-DVtgz3c1.js";import"./usePress-RLqNI-Pb.js";import"./textSelection-LJfdl7Co.js";import"./useHover-BBgMw-bK.js";import"./FieldError-riGjFw4K.js";import"./Text-C3mE0SGj.js";import"./useFormValidation-CyDnBQXe.js";import"./ListBox-Cm2QwHIq.js";import"./useCollection-CPv6Fmqr.js";import"./keyboard-B5QxFQnB.js";import"./FocusScope-CZYPBkiN.js";import"./useEvent-DFdiJ6W_.js";import"./useControlledState-CdUkXr5H.js";import"./getItemCount-_-qK9cjX.js";import"./Autocomplete-DlCmDG_G.js";import"./useLocalizedStringFormatter-BXfXtci2.js";import"./useListState-BEwA7cae.js";import"./Dialog-DvvYxolb.js";import"./Heading-D1IKxfRQ.js";import"./useOverlayTriggerState-Bzrpe4h8.js";import"./VisuallyHidden-Di5CO8Lh.js";import"./animation-EQr5ceW1.js";import"./useField-BccbeYM4.js";import"./useFormReset-BChojrP9.js";import"./Input-BCWvt78D.js";import"./SearchField-BAlpRwur.js";import"./useTextField-AejuSCEH.js";import"./useFilter-CRg0ZZez.js";import"./useCollectionAdapter-BNyA29Fk.js";import"./Avatar-Bw6YSPrB.js";import"./Skeleton-Cm6Jahw7.js";import"./FieldLabel-5I2t4IVW.js";import"./FieldError-DYOwJyYW.js";import"./Popover-CucQ0ELX.js";import"./Text-CEG9LOkG.js";import"./ButtonIcon-BmcRjrhZ.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
