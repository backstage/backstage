import{j as o}from"./iframe-Dyaavudc.js";import{c as e}from"./plugin-B7b2_-xI.js";import{S as l}from"./Grid-yjQsuTcw.js";import{C as m}from"./ComponentAccordion-Chl3-nOk.js";import{w as a}from"./appWrappers-BwtxeNt8.js";import{T as i}from"./TemplateBackstageLogoIcon-DQM9hymr.js";import{I as s}from"./InfoCard-DK6hsUUn.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-BsRKYY6H.js";import"./componentData-mOOEbSJD.js";import"./useAnalytics-DFiGEzjB.js";import"./useApp-zMMbOjHG.js";import"./useRouteRef-CDGbELMm.js";import"./index-QN8QI6Oa.js";import"./DialogTitle-BgPww_-x.js";import"./Modal-CXTgK8no.js";import"./Portal-CUQx1RGJ.js";import"./Backdrop-BD2Exnk-.js";import"./Button-p78_XACY.js";import"./useObservable-BBC86g22.js";import"./useIsomorphicLayoutEffect-DkTgiNn7.js";import"./ExpandMore-4_EAOpPR.js";import"./AccordionDetails-D6NyoHkL.js";import"./index-DnL3XN75.js";import"./Collapse-C_ACyz1D.js";import"./useAsync-Cwh-MG41.js";import"./useMountedState-Ca6tx6sG.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-CjCki9P1.js";import"./ErrorBoundary-CbyPL_-Y.js";import"./ErrorPanel-B2YZjnJe.js";import"./WarningPanel-D7uKb3M5.js";import"./MarkdownContent-B1fiby4H.js";import"./CodeSnippet-CvU93WqX.js";import"./Box-BBMZCdvE.js";import"./styled-DUE4Vhg9.js";import"./CopyTextButton-BAX6zuMk.js";import"./useCopyToClipboard-LvANOgWh.js";import"./Tooltip-Ty7zpOlh.js";import"./Popper-DhZ8DQVo.js";import"./List-CD5TLS8H.js";import"./ListContext-tHxur0ox.js";import"./ListItem-Cw_mLBpk.js";import"./ListItemText-C5HwvlyG.js";import"./LinkButton-CK_Oj2Uu.js";import"./Link-BzX_mGVi.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-CdFGMhF2.js";import"./Divider-CazGSVhv.js";import"./CardActions-CWomgJq0.js";import"./BottomLink-BaDCUbTb.js";import"./ArrowForward-BJ4TDo_a.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <Grid item xs={12} md={6}>
      <HomePageToolkit tools={Array(8).fill({
      url: '#',
      label: 'link',
      icon: <TemplateBackstageLogoIcon />
    })} />
    </Grid>;
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  const ExpandedComponentAccordion = (props: any) => <ComponentAccordion expanded {...props} />;
  return <InfoCard title="Toolkit" noPadding>
      <Grid item>
        <HomePageToolkit title="Tools 1" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ExpandedComponentAccordion} />
        <HomePageToolkit title="Tools 2" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
        <HomePageToolkit title="Tools 3" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
      </Grid>
    </InfoCard>;
}`,...t.parameters?.docs?.source}}};const uo=["Default","InAccordion"];export{r as Default,t as InAccordion,uo as __namedExportsOrder,co as default};
