import{aN as x,r as b,aO as P,j as e,p as f,M as y}from"./iframe-bgo7e1e-.js";import{P as l}from"./PluginHeader-CCtklOin.js";import{C as p}from"./Container-CClMX2vx.js";import{T as t}from"./Text-CkSbbiPb.js";import{B as j}from"./BUIProvider-Cgy7veQb.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BgwxsXea.js";import"./utils-JzHJCY_V.js";import"./useObjectRef-CabhlhRH.js";import"./useCollection-j59lhran.js";import"./useFocusRing-DOOJwv5m.js";import"./openLink-CoSKtbHP.js";import"./Hidden-DUW6jk9t.js";import"./keyboard-CofsTAMo.js";import"./getMetaValue-BiI45Giv.js";import"./FocusScope-DFEKdcB-.js";import"./useEvent-D0SamW91.js";import"./I18nProvider-8UDR-sqk.js";import"./usePress-CGAKik1n.js";import"./textSelection-LFcdZiJl.js";import"./useControlledState-D401CQPw.js";import"./Link-DFMpv6os.js";import"./useLink-odVdQfVt.js";import"./useHover-C9083PQk.js";import"./useLocalizedStringFormatter-Ddoy7_EZ.js";import"./Button-BsHltkoL.js";import"./Label-CxmmfCmf.js";import"./useLabel--gwqzVgP.js";import"./useLabels-Bim8pLbU.js";import"./number-Du54yJ_D.js";import"./useButton-DHRbxGTd.js";import"./Menu-DrlG6OiB.js";import"./Autocomplete-CX9a_7R4.js";import"./useLoadMoreSentinel-D4EJNrn7.js";import"./Input-UoES9vPn.js";import"./ListBox-L-Akeuax.js";import"./SelectionIndicator-Dr4s2gbV.js";import"./Text-DJaB50CO.js";import"./useListState-CfmtYrGr.js";import"./Dialog-DJM3rWs2.js";import"./Heading-C1h_-W8s.js";import"./useOverlayTriggerState-BqjmD4iR.js";import"./VisuallyHidden-DKLyijvJ.js";import"./animation-BxLvfosO.js";import"./SearchField-B_t_og7f.js";import"./FieldError-CMlcXu_V.js";import"./Form-3GgSwjy3.js";import"./useFormValidation-DlvMgxhK.js";import"./useTextField-CEqGEAML.js";import"./useField-B6TWCboz.js";import"./useFormReset-8GFVl-Zj.js";import"./Virtualizer-Ct578QC9.js";import"./useFilter-DbmJvkFb.js";import"./getNodeText-B0_vUkG_.js";import"./Link-C0Cx_gYh.js";import"./useResolvedHref-DApfFiY0.js";import"./Tooltip-D_0Yqn9j.js";import"./VisuallyHidden-CpVJwUaJ.js";import"./Tabs-CMiq7UDC.js";import"./useHasTabbableChild-R-G_zb1j.js";import"./BUIRoutingProvider-C6RuvasO.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=P(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
