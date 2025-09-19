import{j as o}from"./iframe-BkB0QVAX.js";import{c as e}from"./plugin-DI1j4xAJ.js";import{S as l}from"./Grid-GzVmgdg9.js";import{C as m}from"./ComponentAccordion-CpamkEIV.js";import{w as a}from"./appWrappers-BeDZegEM.js";import{T as i}from"./TemplateBackstageLogoIcon-dbh2gqem.js";import{I as s}from"./InfoCard-vDgIcNkq.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-BB1nd9si.js";import"./componentData-BqyKlC7z.js";import"./useAnalytics-BaiO7IUZ.js";import"./useApp-BcKqXm1b.js";import"./useRouteRef-D7AJ89qx.js";import"./index-CG9-iTWl.js";import"./DialogTitle-BDGKjWc8.js";import"./Modal-BGWqml8P.js";import"./Portal-CniYJQFb.js";import"./Backdrop-V6ewlv6k.js";import"./Button-VsEN5bia.js";import"./useObservable-ix0ZtonL.js";import"./ExpandMore-BpFbETJI.js";import"./AccordionDetails-BPj0HgKP.js";import"./index-DnL3XN75.js";import"./Collapse-CFXKULw1.js";import"./useAsync-xBHTNlYp.js";import"./useMountedState-pzVPha7m.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-C9KAu5n0.js";import"./ErrorBoundary-CG99R0aj.js";import"./ErrorPanel-33EFS4fI.js";import"./WarningPanel-C4fTNgaU.js";import"./MarkdownContent-C_11qXRU.js";import"./CodeSnippet-928r43_H.js";import"./Box-BYh2ueao.js";import"./styled-BkGenL9r.js";import"./CopyTextButton-SuTXHCNw.js";import"./useCopyToClipboard-ybsekL_1.js";import"./Tooltip-Cw7U8Fon.js";import"./Popper-CoIZ3FWg.js";import"./List-CL3RsQbd.js";import"./ListContext-1D3zRM57.js";import"./ListItem-uoYhpxef.js";import"./ListItemText-ClLUctdJ.js";import"./LinkButton-Dk1fxXeJ.js";import"./Link-DEl3EO73.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-CjkICost.js";import"./Divider-BE4Qblaw.js";import"./CardActions-C5dkW2n_.js";import"./BottomLink-kRokVK0c.js";import"./ArrowForward-BeJ_-l-J.js";const so={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
}`,...t.parameters?.docs?.source}}};const co=["Default","InAccordion"];export{r as Default,t as InAccordion,co as __namedExportsOrder,so as default};
