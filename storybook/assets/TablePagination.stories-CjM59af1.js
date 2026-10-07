import{T as P}from"./TablePagination-qFWBle74.js";import"./iframe-DsaViRt6.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-C8p51AiY.js";import"./index-B0Q9OrQR.js";import"./Select-BVIlyGOX.js";import"./Button-S9X553hq.js";import"./utils-BMtDQ3Mp.js";import"./Label-BVmI6bof.js";import"./Hidden-D546-sk9.js";import"./useFocusRing-BGqp868t.js";import"./openLink-DOqnQA7B.js";import"./useLabel-yKsWsykb.js";import"./useLabels-DdirUbZa.js";import"./number-DJMv4vuV.js";import"./I18nProvider-C_4m3VHk.js";import"./useButton-Tyy1zmtL.js";import"./usePress-DMXgY0oY.js";import"./textSelection-8YvAK-Rq.js";import"./useHover-DqXkt4DH.js";import"./FieldError-TG0Riy-r.js";import"./Text-GoRNm5GP.js";import"./useFormValidation-BtIFnSNg.js";import"./ListBox-sjCYFeen.js";import"./useCollection-Cs0xDMvq.js";import"./keyboard-uKxI18m4.js";import"./FocusScope-CR9tPNWo.js";import"./useEvent-gqYo67_a.js";import"./useControlledState-C9PUVjXY.js";import"./getItemCount-B7fxe3k-.js";import"./Autocomplete-I0IZMQ4E.js";import"./useLocalizedStringFormatter-Dhnzadev.js";import"./useListState-Gx-EzyDz.js";import"./Dialog-D8aXriuN.js";import"./Heading-DAe5mcha.js";import"./useOverlayTriggerState-AJWVqgd9.js";import"./VisuallyHidden-BwUv9CCW.js";import"./animation-BJNMN6_t.js";import"./useField-ET5d43gu.js";import"./useFormReset-DkLfLBli.js";import"./Input-0kUbtdsi.js";import"./SearchField-BuWO_BBj.js";import"./useTextField-CDL3kK35.js";import"./useFilter-PzttL9Gi.js";import"./useCollectionAdapter-CwxbBlCH.js";import"./Avatar-BYuJwmBk.js";import"./Skeleton-BbD-5xS8.js";import"./FieldLabel-BpTp83Hp.js";import"./FieldError-s_CVaK5q.js";import"./Popover-DNsCFbbi.js";import"./Text-CL9Rzloh.js";import"./ButtonIcon-DZtq07FP.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
