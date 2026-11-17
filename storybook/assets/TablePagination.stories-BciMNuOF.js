import{T as P}from"./TablePagination-Bvs39eMO.js";import"./iframe-Czj8FpnD.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-CyY6Q9V8.js";import"./index-BCAPzNLa.js";import"./Select-CuDZ9jeS.js";import"./BUIRoutingProvider-BITBZMZ0.js";import"./useFocusRing-CwUtzNaZ.js";import"./Button-WAnZG6Vk.js";import"./utils-Cs3-rVue.js";import"./Label-Blh7v6VS.js";import"./Hidden-D92ts2Xi.js";import"./useLabel-v9mJauUl.js";import"./useLabels-CAcUUNYA.js";import"./number-BSntpDAw.js";import"./I18nProvider-DcvSd-3L.js";import"./useButton-DuqPYhB5.js";import"./usePress-BgiTNIgt.js";import"./textSelection-YqIZsSWD.js";import"./getMetaValue-DkJYbvS7.js";import"./useHover-DmfU1sNI.js";import"./FieldError-602GnWts.js";import"./Text-BOev6yT9.js";import"./Form-CftNTrRl.js";import"./useFormValidation-D1qrE1xb.js";import"./ListBox-L2Ctf3fb.js";import"./useCollection-ChjTTmHK.js";import"./keyboard-c2N8M041.js";import"./FocusScope-DZbcaNEi.js";import"./useEvent-CErUhJ3S.js";import"./useControlledState-BUpBSTwT.js";import"./useLoadMoreSentinel-C2YCAk4l.js";import"./Autocomplete-BDXH7E14.js";import"./useLocalizedStringFormatter-C-EjHsV9.js";import"./SelectionIndicator-Ckw1-Jgz.js";import"./useListState-BFfb8iUr.js";import"./Dialog-BeTbgKAz.js";import"./Heading-BqkG8VAl.js";import"./useOverlayTriggerState-2rMwEAbI.js";import"./VisuallyHidden-C9MwevTz.js";import"./animation-DTzXe6sA.js";import"./useField-C3mbQURX.js";import"./useFormReset-DoJay8y7.js";import"./Input-CYxhsLNI.js";import"./SearchField-Bm7qhkOO.js";import"./useTextField-B2QbAykk.js";import"./useFilter-6oERmyxI.js";import"./useCollectionAdapter-iOh4AbtX.js";import"./Avatar-C7-JtEdz.js";import"./Skeleton-eyPNAWgH.js";import"./FieldLabel-C5CTMYug.js";import"./FieldError-d4RsaUXq.js";import"./Popover-BokETxh4.js";import"./Text-7TRQ-xvv.js";import"./ButtonIcon-CpDPbKJJ.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const he=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,o as FirstPage,a as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,he as __namedExportsOrder,de as default};
