import{aO as x,r as b,aP as P,j as e,p as f,M as y}from"./iframe-CxlUpTpq.js";import{P as l}from"./PluginHeader-C5r-axDZ.js";import{C as p}from"./Container-C_7Ae0ic.js";import{T as t}from"./Text-BnjPxtF1.js";import{B as j}from"./BUIProvider-DWmcpNws.js";import"./preload-helper-PPVm8Dsz.js";import"./index-m_RVXM54.js";import"./utils-BiH69BEF.js";import"./useObjectRef-Dh3jViZn.js";import"./useCollection-Bo0XBD87.js";import"./useFocusRing-DKBxNAkp.js";import"./openLink-DT4-HiOA.js";import"./Hidden-f_G1o6Y7.js";import"./keyboard-Cx6bvV3F.js";import"./FocusScope-YrQuOEYJ.js";import"./useEvent-Duv0WJvN.js";import"./I18nProvider-g-YIgX08.js";import"./usePress-BAaUvFTM.js";import"./textSelection-B_r4mkkT.js";import"./useControlledState-CxsccuSa.js";import"./Link-D1A8VWvc.js";import"./useLink-Bo6f_MnZ.js";import"./useHover-DMFi8o2f.js";import"./useLocalizedStringFormatter-CusjQb-x.js";import"./Button-Dk1TuodQ.js";import"./Label-Ci2BW9le.js";import"./useLabel-DDDO_Y6W.js";import"./useLabels-ZAvHqBgR.js";import"./number-wfr-a2dw.js";import"./useButton-DqI1YsZH.js";import"./Menu-CS1eJLoR.js";import"./Autocomplete-DKAPF810.js";import"./getItemCount-7dUMKGgw.js";import"./Input-cUEZAZ1h.js";import"./ListBox-DPwHHXW0.js";import"./Text-BTU8fM3z.js";import"./useListState-6GcH4O3w.js";import"./Dialog-CLzWZ8kX.js";import"./Heading-DuCmUnSY.js";import"./useOverlayTriggerState-G8ih59XW.js";import"./VisuallyHidden-CgJk2kmU.js";import"./animation-D6w75ks6.js";import"./SearchField-C1i_rKX7.js";import"./FieldError-CbBZt737.js";import"./useFormValidation-CsOIPDNg.js";import"./useTextField-BOI3orl0.js";import"./useField-Bu9yMuoU.js";import"./useFormReset-BXjwexTG.js";import"./Virtualizer-B_RZp3_p.js";import"./useFilter-NlzrNSaD.js";import"./getNodeText-Dcnyi_vD.js";import"./Link-xjP27hSY.js";import"./useResolvedHref-CfM4jAOQ.js";import"./Tooltip-CHTJ2CJI.js";import"./VisuallyHidden-DS-JravK.js";import"./Tabs-Ds2zx5Gg.js";import"./useHasTabbableChild-lPvypB5T.js";import"./BUIRoutingProvider-CBigqi8l.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
})`,...s.input.parameters?.docs?.source}}};const Se=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,Se as __namedExportsOrder};
