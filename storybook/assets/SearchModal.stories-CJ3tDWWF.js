import{j as t,W as d,a3 as u,a2 as h}from"./iframe-CY7lbe83.js";import{r as g}from"./plugin-CLV8L5ye.js";import{S as l,u as n,a as x}from"./useSearchModal-DvJ3IvQu.js";import{B as c}from"./Button-tx84uWRl.js";import{D as S,a as f,b as M}from"./DialogTitle-Cl94vI-K.js";import{B as j}from"./Box-gZ8thPU9.js";import{S as r}from"./Grid-DcImk4IG.js";import{S as C}from"./SearchType-CY_oLqfJ.js";import{L as y}from"./List-Ci1Aezal.js";import{H as I}from"./DefaultResultListItem-CyCRtm_b.js";import{w as R}from"./appWrappers-BkjPugr5.js";import{m as B}from"./makeStyles-BGiSvRlD.js";import{s as D,M as k}from"./api-RANgG4sX.js";import{S as v}from"./SearchContext-B_vM-Wx6.js";import{SearchBar as T}from"./SearchBar-DlEtcNsR.js";import{S as b}from"./SearchResult-UlRZaR-y.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DT3rKjPM.js";import"./Plugin-DuCfxpjl.js";import"./componentData-CByqKmWR.js";import"./useAnalytics-BhHlZ_-q.js";import"./useApp-BWWc3uRn.js";import"./useRouteRef-I9QFdr3L.js";import"./ArrowForward-BB9fsLEC.js";import"./translation-CMdIkqnU.js";import"./Page-BENV0lfr.js";import"./useMediaQuery-BLk1PnQd.js";import"./Divider-DSnv80CJ.js";import"./ArrowBackIos-BJc7K7oY.js";import"./ArrowForwardIos-B9g-8o24.js";import"./translation-DWZO4TLY.js";import"./Modal-IARjO0T0.js";import"./Portal-DEwmDmBY.js";import"./Backdrop-Qdj5xokV.js";import"./styled-CZ8uUDah.js";import"./ExpandMore-BuW45XRi.js";import"./useAsync-Ce2duhZU.js";import"./useMountedState-B5irowov.js";import"./AccordionDetails-QEpfY1Be.js";import"./index-B9sM2jn7.js";import"./Collapse-PXpyupz1.js";import"./ListItem-CeQUv4cf.js";import"./ListContext-CUuh2mol.js";import"./ListItemIcon-Bb58vPnf.js";import"./ListItemText-DYXqavrO.js";import"./Tabs-qiNJ6Qji.js";import"./KeyboardArrowRight-DT4qefvW.js";import"./FormLabel-D1E2VRe6.js";import"./formControlState-DJQ6AyAa.js";import"./InputLabel-OM-gE7vD.js";import"./Select-CSrmOJE_.js";import"./Popover-r9Lec8C5.js";import"./MenuItem-C0HdtAZX.js";import"./Checkbox-0_Zn4g-8.js";import"./SwitchBase-Dpfdllgq.js";import"./Chip-CVJRyRh9.js";import"./Link-Ccz9XHl0.js";import"./index-B1QT4D-J.js";import"./lodash-ADtPu9nK.js";import"./WebStorage-BkF2UwkU.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-D9CqdtXf.js";import"./useIsomorphicLayoutEffect-C8TC6PZA.js";import"./BUIProvider-CE7xZB_K.js";import"./openLink-BO2-TBpk.js";import"./useResolvedHref-Cg-iTelS.js";import"./Search-BYOdAg6i.js";import"./useDebounce-DoYB4bsT.js";import"./InputAdornment-C4WPgVyv.js";import"./TextField-B_Hv9u3f.js";import"./useElementFilter-Dck4xNND.js";import"./EmptyState-CQ-87ZoV.js";import"./Progress-Byk734N3.js";import"./LinearProgress-Cd73FyvB.js";import"./ResponseErrorPanel-DKDcT5YN.js";import"./ErrorPanel-4LghmRCc.js";import"./WarningPanel-HsNEbXDc.js";import"./MarkdownContent-DYmYI5js.js";import"./CodeSnippet-h4AUX-n_.js";import"./CopyTextButton-Cl87XUod.js";import"./useCopyToClipboard-C_KwtDOM.js";import"./Tooltip-COPl2w0n.js";import"./Popper-DCMX2Z1y.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(l,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:m})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:m},m.location)},`${m.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const po=["Default","CustomModal"];export{s as CustomModal,i as Default,po as __namedExportsOrder,co as default};
