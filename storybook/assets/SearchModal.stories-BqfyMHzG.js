import{j as t,S as d,a0 as u,$ as h}from"./iframe-v7Qh39PS.js";import{r as g}from"./plugin-CZq3r1yZ.js";import{S as m,u as n,a as x}from"./useSearchModal-D4r1VhM6.js";import{B as c}from"./Button-BsIYWZbj.js";import{D as S,a as f,b as M}from"./DialogTitle-BRHdEqtr.js";import{B as j}from"./Box-DXZBhROx.js";import{S as r}from"./Grid-CVRWW0PN.js";import{S as C}from"./SearchType-BR9IF7XL.js";import{L as y}from"./List-xof-D_2B.js";import{H as I}from"./DefaultResultListItem-BY-GyBEA.js";import{w as R}from"./appWrappers-D6b7xw5N.js";import{m as B}from"./makeStyles-DymchkiN.js";import{s as D,M as k}from"./api-C0B7vJ0F.js";import{S as v}from"./SearchContext-BvHzKSA1.js";import{SearchBar as T}from"./SearchBar-BYNeqeTD.js";import{S as b}from"./SearchResult-Ddktwhhc.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CrmaefLc.js";import"./Plugin-BKZ2RQuL.js";import"./componentData-BdTSXjQo.js";import"./useAnalytics-C6qawMj-.js";import"./useApp-BPx4QKeD.js";import"./useRouteRef-BCSVyb25.js";import"./ArrowForward-eDGe6SHn.js";import"./translation-U0dfjs-Y.js";import"./Page-BTSc7urH.js";import"./useMediaQuery-DosH5Bsg.js";import"./Divider-Bo3do-UZ.js";import"./ArrowBackIos-CaXcsoe5.js";import"./ArrowForwardIos-DuQ-60R6.js";import"./translation-DPe2HoYB.js";import"./Modal-CY2x_xo2.js";import"./Portal-GMu86kgZ.js";import"./Backdrop-CfdHGxaY.js";import"./styled-BwMArDgT.js";import"./ExpandMore-CojGXmQl.js";import"./useAsync-Cr1-y7Ak.js";import"./useMountedState-B1L7ZtKY.js";import"./AccordionDetails-BRINvrzF.js";import"./index-B9sM2jn7.js";import"./Collapse-DHnL6Jrd.js";import"./ListItem-Dah0XUNP.js";import"./ListContext-DDzxA-kC.js";import"./ListItemIcon-DmrGwb-x.js";import"./ListItemText-wNXBjsZ9.js";import"./Tabs-Z6-5NjA4.js";import"./KeyboardArrowRight-B627XF8P.js";import"./FormLabel-yFRpNzCW.js";import"./formControlState-BYK5T-aD.js";import"./InputLabel-BEOmw5bT.js";import"./Select-OXF1hz-e.js";import"./Popover-BvLyvlr_.js";import"./MenuItem-CAh12VsF.js";import"./Checkbox-Spm6kD6_.js";import"./SwitchBase-DI0r_c12.js";import"./Chip-DYsJS2ci.js";import"./Link-C_cLMUQT.js";import"./index-B0lXpw7A.js";import"./lodash-Djj2Rbh9.js";import"./WebStorage-D8p_ctuC.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BFewEPuc.js";import"./useIsomorphicLayoutEffect-BSEkt-Q0.js";import"./BUIProvider-Dq073qxq.js";import"./openLink-DhJYPLui.js";import"./Search-DhOwI9Wh.js";import"./useDebounce-BdKhadhM.js";import"./InputAdornment-JbDA_YZt.js";import"./TextField-BNPWsTYA.js";import"./useElementFilter-DHYQIpoU.js";import"./EmptyState-DH-47mbI.js";import"./Progress-BHbYpJol.js";import"./LinearProgress-7t2XzrX1.js";import"./ResponseErrorPanel-Bk1olW0k.js";import"./ErrorPanel-BUErKsp_.js";import"./WarningPanel-BpTsYYgl.js";import"./MarkdownContent-C8vaRnvo.js";import"./CodeSnippet-D0HCGu2u.js";import"./CopyTextButton-BS4z7_Ar.js";import"./useCopyToClipboard-BGXliAh_.js";import"./Tooltip-DfWrtCLA.js";import"./Popper-DLRR1cRg.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},no={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
