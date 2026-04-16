import{j as t,S as d,a0 as u,$ as h}from"./iframe-B7ESvRaB.js";import{r as g}from"./plugin-DJoPWbMY.js";import{S as m,u as n,a as x}from"./useSearchModal-C774DkGc.js";import{B as c}from"./Button-DQmR4fSC.js";import{D as S,a as f,b as M}from"./DialogTitle-DzDf3Yya.js";import{B as j}from"./Box-BGVcxrSI.js";import{S as r}from"./Grid-DUZSx2Cf.js";import{S as C}from"./SearchType-CQ1GFa4F.js";import{L as y}from"./List-BzC9H2Gx.js";import{H as I}from"./DefaultResultListItem-BGeNTrA-.js";import{w as R}from"./appWrappers-B_c5bIZW.js";import{m as B}from"./makeStyles-D6c8jQg1.js";import{s as D,M as k}from"./api-DgcJAyq0.js";import{S as v}from"./SearchContext-DZK8HDo_.js";import{SearchBar as T}from"./SearchBar-C6HooFgC.js";import{S as b}from"./SearchResult-BAz2vmj6.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C_yr9fQs.js";import"./Plugin-C5slbFDz.js";import"./componentData-CTm3m7bd.js";import"./useAnalytics-DL1ROu7Z.js";import"./useApp--u6yStsZ.js";import"./useRouteRef-D9OOGBTZ.js";import"./ArrowForward-BtiVNM8z.js";import"./translation-BT3i3_9i.js";import"./Page-D0vuqOxv.js";import"./useMediaQuery-CTo7lni9.js";import"./Divider-BR90CobV.js";import"./ArrowBackIos-ldJ3-RgE.js";import"./ArrowForwardIos-rAtbABq2.js";import"./translation-Ds-_GOlo.js";import"./Modal-ChytUIep.js";import"./Portal-Dv8WnOrA.js";import"./Backdrop-CVpmcIIL.js";import"./styled-BYmoTReO.js";import"./ExpandMore-DiriN8Nn.js";import"./useAsync-lhj5D5yY.js";import"./useMountedState-BXWtuRQC.js";import"./AccordionDetails-CItzjruw.js";import"./index-B9sM2jn7.js";import"./Collapse-CS_qsOih.js";import"./ListItem-D3zRoU3Q.js";import"./ListContext-Cg-0b41u.js";import"./ListItemIcon-Cqsrm8B_.js";import"./ListItemText-B-vocj-6.js";import"./Tabs-DIBFlzeO.js";import"./KeyboardArrowRight-PK_TzxE4.js";import"./FormLabel-COPvra3B.js";import"./formControlState-DSaLKlxx.js";import"./InputLabel-AgBtk_KV.js";import"./Select-BUW32kJN.js";import"./Popover-B6eOqlBd.js";import"./MenuItem-CjYY4OVG.js";import"./Checkbox-DBc1EEw7.js";import"./SwitchBase-WWm-OsBN.js";import"./Chip-BcDHZok9.js";import"./Link-BVbc5K8M.js";import"./index-DWyhtxdM.js";import"./lodash-Bt12QuHv.js";import"./WebStorage-CJ5eooK1.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CRBsktBv.js";import"./useIsomorphicLayoutEffect-Dnhk4D_O.js";import"./BUIProvider-sIkzvwhM.js";import"./openLink-BFNE09ao.js";import"./Search-DCxjrjjk.js";import"./useDebounce-C492-lVj.js";import"./InputAdornment-VZXoVCjp.js";import"./TextField-CZlmyRBW.js";import"./useElementFilter-DO09yBqo.js";import"./EmptyState-BiayQsmq.js";import"./Progress-DYJEYHr0.js";import"./LinearProgress-Z04LLFhS.js";import"./ResponseErrorPanel-ZWcBUucq.js";import"./ErrorPanel-m--ZC33I.js";import"./WarningPanel-U0rftR-m.js";import"./MarkdownContent-xPhYglMC.js";import"./CodeSnippet-BuVXZKcB.js";import"./CopyTextButton-CEaatXng.js";import"./useCopyToClipboard-PWgpe9Dd.js";import"./Tooltip-DDcr_SxO.js";import"./Popper-B4XOTFHE.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},no={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...s.parameters?.docs?.source}}};const co=["Default","CustomModal"];export{s as CustomModal,i as Default,co as __namedExportsOrder,no as default};
