import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-D4YkWMPd.js";import{s as g,H as u}from"./plugin-DbSWKguG.js";import{c as h}from"./api-CHa4E_yJ.js";import{c as f}from"./catalogApiMock-iR8sMwec.js";import{s as x}from"./api-DzNVbBJY.js";import{S as y}from"./SearchContext-BiwAE7eM.js";import{P as S}from"./Page-DwgQN_UR.js";import{S as r}from"./Grid-3dbGowTG.js";import{b as k,a as j,c as C}from"./plugin-seGdHiiS.js";import{T as P}from"./TemplateBackstageLogo-C_UZ6ajO.js";import{T}from"./TemplateBackstageLogoIcon-4IgW3rbm.js";import{e as I}from"./routes-Cexw77UQ.js";import{w as v}from"./appWrappers-BdS3ZXd0.js";import{s as G}from"./StarredEntitiesApi-chuiYc2p.js";import{M as A}from"./MockStarredEntitiesApi-CM4bYYSs.js";import{I as B}from"./InfoCard-DekS9cui.js";import"./preload-helper-D9Z9MdNV.js";import"./index-DcRSVOOI.js";import"./Plugin-CS5_JnCA.js";import"./componentData-C4oKpH_t.js";import"./useAnalytics--ii2Xnv1.js";import"./useApp-BYOY4yJv.js";import"./useRouteRef-Dr-zIQ4_.js";import"./index-Cb5ApCX3.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./useAsync-DFwDLbfT.js";import"./useMountedState-BZeJdOiH.js";import"./DialogTitle-ikIQGFRt.js";import"./Modal-BPzxcCH2.js";import"./Portal-GmGr81qv.js";import"./Backdrop-BWtXXt1T.js";import"./Button-bLTRgJ4c.js";import"./useObservable-DbwS_JUV.js";import"./useIsomorphicLayoutEffect-CKq4zRUd.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-CH-NP11H.js";import"./ErrorBoundary-Dj_BdtLc.js";import"./ErrorPanel-geXzwKYb.js";import"./WarningPanel-CPZUUyuU.js";import"./ExpandMore-Bpioo4yy.js";import"./AccordionDetails-DKrusFPL.js";import"./index-DnL3XN75.js";import"./Collapse-CyHojAhw.js";import"./MarkdownContent-DNug9PDQ.js";import"./CodeSnippet-Dl0gP_YZ.js";import"./Box-CrXhOgBb.js";import"./styled-dYo-GhGI.js";import"./CopyTextButton-GQ6DbX_U.js";import"./useCopyToClipboard-CXAMfyh-.js";import"./Tooltip-BBJrGxop.js";import"./Popper-BtazmgWL.js";import"./List-DbiJVjlG.js";import"./ListContext-C8PRUhDY.js";import"./ListItem-C4617hHA.js";import"./ListItemText-C8w1SX_U.js";import"./LinkButton-bYk9cqtO.js";import"./Link-Cg_HU4j2.js";import"./CardHeader-B1-VM8pp.js";import"./Divider-DoiUQK47.js";import"./CardActions-CBi48CeD.js";import"./BottomLink-Ckmh1WY3.js";import"./ArrowForward-ZRQV-YG0.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    svg,
    path,
    container
  } = useLogoStyles();
  return <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo className={container} logo={<TemplateBackstageLogo classes={{
            svg,
            path
          }} />} />
            <Grid container item xs={12} justifyContent="center">
              <HomePageSearchBar InputProps={{
              classes: {
                root: classes.searchBarInput,
                notchedOutline: classes.searchBarOutline
              }
            }} placeholder="Search" />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <HomePageStarredEntities />
              </Grid>
              <Grid item xs={12} md={6}>
                <HomePageToolkit tools={Array(8).fill({
                url: '#',
                label: 'link',
                icon: <TemplateBackstageLogoIcon />
              })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoCard title="Composable Section">
                  {/* placeholder for content */}
                  <div style={{
                  height: 370
                }} />
                </InfoCard>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>;
}`,...o.parameters?.docs?.source}}};const zt=["DefaultTemplate"];export{o as DefaultTemplate,zt as __namedExportsOrder,Wt as default};
