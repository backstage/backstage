import{aO as x,r as b,aP as P,j as e,p as f,M as y}from"./iframe-GY9q4FO8.js";import{P as l}from"./PluginHeader-WpPQG1BJ.js";import{C as p}from"./Container-f1Flg0xK.js";import{T as t}from"./Text-Mxo4Je-M.js";import{B as j}from"./BUIProvider-CuGVHqZV.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CbkTlW2S.js";import"./utils-UG8wIxPz.js";import"./useObjectRef-DlPyeYly.js";import"./useCollection-DtPONGaC.js";import"./useFocusRing-BlRt_wPT.js";import"./openLink-CFz-JK3Y.js";import"./Hidden-nquVvtJw.js";import"./keyboard-BCJcwUXR.js";import"./getMetaValue-XB_wrXKe.js";import"./FocusScope-DHVX7U6d.js";import"./useEvent-aycS7oPM.js";import"./I18nProvider-BhiwSHej.js";import"./usePress-CTng4HyG.js";import"./textSelection-DeC98-eF.js";import"./useControlledState-BK9RR_T7.js";import"./Link-B683WMmT.js";import"./useLink-yFoTiDc4.js";import"./useHover-BHwy1G7-.js";import"./useLocalizedStringFormatter-BqaF7StP.js";import"./Button-gV3JsRfd.js";import"./Label-Bc_GMvnu.js";import"./useLabel-uMVcdOMo.js";import"./useLabels-DnIs0d0f.js";import"./number-B5JXBwAu.js";import"./useButton-CUs3xyC6.js";import"./Menu-CmK3flt1.js";import"./Autocomplete-CrQwLSiz.js";import"./useLoadMoreSentinel-Dss4yWwT.js";import"./Input-DXacu7fD.js";import"./ListBox-CXOtftYI.js";import"./SelectionIndicator-ClprgyfK.js";import"./Text-CCPuhEw_.js";import"./useListState-C4X4wGMp.js";import"./Dialog-CHsgvMd8.js";import"./Heading-htnlGJCA.js";import"./useOverlayTriggerState-6qevt50p.js";import"./VisuallyHidden-D2jW1EXZ.js";import"./animation-CJ3qHqN2.js";import"./SearchField-CbVSMKK_.js";import"./FieldError-w98q6zCm.js";import"./Form-CPARlShW.js";import"./useFormValidation-CIoGHvRM.js";import"./useTextField-DmHH0Qdy.js";import"./useField-B4kUn8PC.js";import"./useFormReset-BLa1fi_u.js";import"./Virtualizer-BefbavPH.js";import"./useFilter-Dpa-GPDt.js";import"./getNodeText-D1xzCoTU.js";import"./Link-CdF8Qk77.js";import"./useResolvedHref-DHULiug-.js";import"./Tooltip-Cl5tUfxA.js";import"./VisuallyHidden-L4OovoEW.js";import"./Tabs-CicwKcAM.js";import"./useHasTabbableChild-BswjRWa9.js";import"./BUIRoutingProvider-Jw2VtAIF.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
