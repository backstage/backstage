import{j as t,m as d,I as u,b as h,T as g}from"./iframe-QBX5Mcuo.js";import{r as x}from"./plugin-bJWcIHXu.js";import{S as m,u as n,a as S}from"./useSearchModal-i_i6zjnG.js";import{B as c}from"./Button-CVwDhsqF.js";import{a as f,b as M,c as j}from"./DialogTitle-BSYcyeQj.js";import{B as C}from"./Box-DE6c26DR.js";import{S as r}from"./Grid-Q_BfCJNG.js";import{S as y}from"./SearchType-sAF-xCrl.js";import{L as I}from"./List-CwkTxoFK.js";import{H as R}from"./DefaultResultListItem-B8U8THpT.js";import{s as B,M as D}from"./api-DRjUYJBX.js";import{S as T}from"./SearchContext-BTMcT43M.js";import{w as k}from"./appWrappers-357IU-cP.js";import{SearchBar as v}from"./SearchBar-DqvQizA1.js";import{a as b}from"./SearchResult-CPqJwW4P.js";import"./preload-helper-D9Z9MdNV.js";import"./index-BWOdk6pr.js";import"./Plugin-BpVAfwk3.js";import"./componentData-DHgvWv9V.js";import"./useAnalytics-Pg_QG9Iq.js";import"./useApp-B1pSEwwD.js";import"./useRouteRef-Bc19hZiH.js";import"./index-CDF8GVFg.js";import"./ArrowForward-C05mkkQp.js";import"./translation-DAnb2S15.js";import"./Page-BMhFzfNN.js";import"./useMediaQuery-D5mDDKvt.js";import"./Divider-DLQMODSR.js";import"./ArrowBackIos-DFpViWrL.js";import"./ArrowForwardIos-CEB_214h.js";import"./translation-NzW_K6qb.js";import"./Modal-B7uRaYS1.js";import"./Portal-D97HJh_z.js";import"./Backdrop-DUF8g36-.js";import"./styled-BjXftXcZ.js";import"./ExpandMore-j96Z6uWc.js";import"./useAsync-DruiAlTJ.js";import"./useMountedState-ByMBzLYV.js";import"./AccordionDetails-D8gh-z9a.js";import"./index-DnL3XN75.js";import"./Collapse-vSwdBrKa.js";import"./ListItem-CcSyfWmu.js";import"./ListContext-BfMtnPb8.js";import"./ListItemIcon-C59ouvwB.js";import"./ListItemText-BayZFfOR.js";import"./Tabs-BmUryN-D.js";import"./KeyboardArrowRight-CMoEYlHv.js";import"./FormLabel-CnwY8pkP.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C8j1xMaB.js";import"./InputLabel-uMDJwPrA.js";import"./Select-Bgn_iEo1.js";import"./Popover-B8q1n2QL.js";import"./MenuItem-rzPQj8Ni.js";import"./Checkbox-hb8VnpDR.js";import"./SwitchBase-erfIXrjN.js";import"./Chip-BMM1uOgH.js";import"./Link-C2fIupIe.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-BTlRHWB4.js";import"./useIsomorphicLayoutEffect-BYNl4sdH.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-Ddc3PesT.js";import"./useDebounce-4QWugzRH.js";import"./InputAdornment-CIyg4J7G.js";import"./TextField-M2_UqjpF.js";import"./useElementFilter-CVthae2L.js";import"./EmptyState-D9SdjIAB.js";import"./Progress-Cvrx13rE.js";import"./LinearProgress-w2JYBnWb.js";import"./ResponseErrorPanel-D3a3fn2r.js";import"./ErrorPanel-Bnda3tGm.js";import"./WarningPanel-Ct6Y8Ijr.js";import"./MarkdownContent-CGXvyksG.js";import"./CodeSnippet-Kn9vBnai.js";import"./CopyTextButton-CQwOrqNE.js";import"./useCopyToClipboard-B79QevPK.js";import"./Tooltip-DOW7o-0E.js";import"./Popper-BpKCcSKx.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};const lo=["Default","CustomModal"];export{i as CustomModal,s as Default,lo as __namedExportsOrder,ao as default};
