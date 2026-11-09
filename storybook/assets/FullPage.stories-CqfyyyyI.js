import{aN as x,r as b,aO as P,j as e,p as f,M as y}from"./iframe-VdnJkTLn.js";import{P as l}from"./PluginHeader-DhdXckDY.js";import{C as p}from"./Container-BsyXfg16.js";import{T as t}from"./Text-CkSWf3Bg.js";import{B as j}from"./BUIProvider-BOKsEIJc.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CJ6_QBDM.js";import"./utils-e0WViHPf.js";import"./useObjectRef-DROp5jky.js";import"./useCollection-Br8OUFQ_.js";import"./useFocusRing-Co2F4F7Z.js";import"./openLink-CXHSNm_V.js";import"./Hidden-CrjggcFY.js";import"./keyboard-4UFf3oj2.js";import"./getMetaValue-Bnreontc.js";import"./FocusScope-ClqMUDpT.js";import"./useEvent-Bizq2OSF.js";import"./I18nProvider-DuHW1abH.js";import"./usePress-CP53JbFw.js";import"./textSelection-KD-GHk6k.js";import"./useControlledState-BaeUY-xI.js";import"./Link-CxTNYRdR.js";import"./useLink-G4ykfhiW.js";import"./useHover-g0RbdZFi.js";import"./useLocalizedStringFormatter-CHFqquPO.js";import"./Button-FF_83t8w.js";import"./Label-DrU_Nnv8.js";import"./useLabel-Bo0JsgFk.js";import"./useLabels-BVBXvlsz.js";import"./number-LCWSkLep.js";import"./useButton-DimFA1zM.js";import"./Menu-DieM3K_e.js";import"./Autocomplete-u1URa5fd.js";import"./useLoadMoreSentinel-y6LHfwV4.js";import"./Input-D2uS1ljc.js";import"./ListBox-CICl156-.js";import"./SelectionIndicator-HJwkdeTK.js";import"./Text-7WPcyscW.js";import"./useListState-DytFXOuB.js";import"./Dialog-DgWiF4Q5.js";import"./Heading-C2TWwXcr.js";import"./useOverlayTriggerState-DSnKjkPC.js";import"./VisuallyHidden-BEl231es.js";import"./animation-5xKztEYB.js";import"./SearchField-C4sKkBca.js";import"./FieldError-B3u2kknD.js";import"./Form-CzyO95mO.js";import"./useFormValidation-DfF2vLy2.js";import"./useTextField-BekYY1fq.js";import"./useField-CsdjVyDw.js";import"./useFormReset-B9eW7vtg.js";import"./Virtualizer-Cly8pmg8.js";import"./useFilter-CLfxtcUI.js";import"./getNodeText-CNOvxiRW.js";import"./Link-CmWQIqXP.js";import"./useResolvedHref-XC1sUx4v.js";import"./Tooltip-B0XS0Rob.js";import"./VisuallyHidden-DysteXZO.js";import"./Tabs-BPyTPTYY.js";import"./useHasTabbableChild-BQPnUoZI.js";import"./BUIRoutingProvider-Bgp8Pk5b.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=P(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
