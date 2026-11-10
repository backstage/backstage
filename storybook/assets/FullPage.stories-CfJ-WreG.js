import{aN as x,r as b,aO as P,j as e,p as f,M as y}from"./iframe-DxBRWUiK.js";import{P as l}from"./PluginHeader-DjaNLYDn.js";import{C as p}from"./Container-DV39nNKl.js";import{T as t}from"./Text-Bl3j3OjI.js";import{B as j}from"./BUIProvider-BTuxSVSJ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DdTIbfdH.js";import"./utils-Cv-9sHfj.js";import"./useObjectRef-VkTcKCoy.js";import"./useCollection-BOr2gC9g.js";import"./useFocusRing-BqPZGEXT.js";import"./openLink-a1B1hwMM.js";import"./Hidden-BdHYJNpU.js";import"./keyboard-OKXMLejU.js";import"./getMetaValue-CUMJm42D.js";import"./FocusScope-DCegT4Rn.js";import"./useEvent-CbVpGXN4.js";import"./I18nProvider-C0Z_fwek.js";import"./usePress-CsaJDvcb.js";import"./textSelection-BAaw7jcY.js";import"./useControlledState-bDAdDYhT.js";import"./Link-QKTRJ2cA.js";import"./useLink-BKrZz-Qk.js";import"./useHover-Cr5thQm_.js";import"./useLocalizedStringFormatter-DVlYVXvg.js";import"./Button-Dc1PTGgx.js";import"./Label-DB2E6Ibv.js";import"./useLabel-DFfcinVE.js";import"./useLabels-DXt0FSFN.js";import"./number-CGe6QRer.js";import"./useButton-CoWwmPj-.js";import"./Menu-DKHmBDRA.js";import"./Autocomplete-Cuv0f5M3.js";import"./useLoadMoreSentinel-BLBdcP_Q.js";import"./Input-vC6TU_h8.js";import"./ListBox-Dg-OCXMR.js";import"./SelectionIndicator-DUa-TMGu.js";import"./Text-B4ka2W6z.js";import"./useListState-DIggCB2b.js";import"./Dialog-B1KZGo_M.js";import"./Heading-Czq643nv.js";import"./useOverlayTriggerState-2jFvCPDw.js";import"./VisuallyHidden-CfmB3iy8.js";import"./animation-LN_WEzBA.js";import"./SearchField-Dho9Dybl.js";import"./FieldError-BdSj5mJC.js";import"./Form-CqE-IOxT.js";import"./useFormValidation-CppbXsgq.js";import"./useTextField-CRwhSld1.js";import"./useField-J-UNgQo7.js";import"./useFormReset-DZizIjt8.js";import"./Virtualizer-BR902YRu.js";import"./useFilter-DwdIslma.js";import"./getNodeText-DFCtRnxJ.js";import"./Link-C2njEB99.js";import"./useResolvedHref-CDpKBnHn.js";import"./Tooltip-DBNAjYz5.js";import"./VisuallyHidden-BqXgvTFq.js";import"./Tabs-rRrHtgzm.js";import"./useHasTabbableChild-vrCOTAot.js";import"./BUIRoutingProvider-ouU5VIyg.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=P(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
