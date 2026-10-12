import{aO as x,r as b,aP as P,j as e,p as f,M as y}from"./iframe-5xJVwFMl.js";import{P as l}from"./PluginHeader-C3hk8RrN.js";import{C as p}from"./Container-DMqfBc1v.js";import{T as t}from"./Text-DhSvT2Uk.js";import{B as j}from"./BUIProvider-CR7et_SE.js";import"./preload-helper-PPVm8Dsz.js";import"./index-W19nKV8Q.js";import"./utils-g1c0Kr3k.js";import"./useObjectRef-COysk4Ng.js";import"./useCollection-Bjf0fzB1.js";import"./useFocusRing-CL8Atm-X.js";import"./openLink-CN5IUfel.js";import"./Hidden-BbW38WTn.js";import"./keyboard-Do48IGOY.js";import"./getMetaValue-CQBj6zNl.js";import"./FocusScope-B-l0JHVh.js";import"./useEvent-BJYs4tdM.js";import"./I18nProvider-CF59bDP3.js";import"./usePress-Cd47Wv9a.js";import"./textSelection-TIBZk0b6.js";import"./useControlledState-DeUghDUN.js";import"./Link-Dp3DG7FD.js";import"./useLink-DnFxUMvO.js";import"./useHover-0u_T0iEc.js";import"./useLocalizedStringFormatter-DPT4WBHg.js";import"./Button-B_04NqPW.js";import"./Label-xTQOkMYl.js";import"./useLabel-DMuCEq2v.js";import"./useLabels-ClOBW_ex.js";import"./number-Dp3Tfxh5.js";import"./useButton-aPTu4J1u.js";import"./Menu-DOlkIrA9.js";import"./Autocomplete-BSWzw426.js";import"./useLoadMoreSentinel-CqHS78wS.js";import"./Input-DHEuej01.js";import"./ListBox-Tx0vjixX.js";import"./SelectionIndicator-DhB9py-C.js";import"./Text-MPpkcO3C.js";import"./useListState-D9qoIJXi.js";import"./Dialog-CbxrPVlf.js";import"./Heading-CHJ5u2XV.js";import"./useOverlayTriggerState-D-pWsPKw.js";import"./VisuallyHidden-BySVkOjk.js";import"./animation-DqGFbVcO.js";import"./SearchField-1fiyVs64.js";import"./FieldError-Yfpcergq.js";import"./Form-fpgMP67S.js";import"./useFormValidation-Bionm8Qj.js";import"./useTextField-BtKb3rjA.js";import"./useField-BdW6ZByv.js";import"./useFormReset-DWokUbV3.js";import"./Virtualizer-CQ9cYtKz.js";import"./useFilter-K8A-0h2d.js";import"./getNodeText-CbLVfIZQ.js";import"./Link-ZEyFrQHy.js";import"./useResolvedHref-Bzhc1BYR.js";import"./Tooltip-B0IbZ4cB.js";import"./VisuallyHidden-CnSNp5OH.js";import"./Tabs-CWIyk7Nd.js";import"./useHasTabbableChild-DOYqG7yB.js";import"./BUIRoutingProvider-BpAJzDJJ.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=f.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage style={{
      backgroundColor: '#c3f0ff'
    }}>
        <Container>
          <Text as="p">
            This content fills the remaining viewport height below the Header.
          </Text>
        </Container>
      </FullPage>
    </>
})`,...o.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage>
        <Container>
          <Text as="h2" variant="title-medium">
            Scrollable Content
          </Text>
          <Text as="p">
            The content below scrolls independently while the Header stays
            pinned at the top.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...a.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" tabs={tabs} />
      <FullPage>
        <Container>
          <Text as="p">
            The FullPage height adjusts automatically when the Header includes
            tabs, thanks to the ResizeObserver measuring the Header's actual
            height.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...s.input.parameters?.docs?.source}}};const _e=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,_e as __namedExportsOrder};
