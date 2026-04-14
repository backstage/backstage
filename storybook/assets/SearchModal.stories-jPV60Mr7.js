import{j as t,S as d,a0 as u,$ as h}from"./iframe-KINrIo_f.js";import{r as g}from"./plugin-DfNor6nX.js";import{S as m,u as n,a as x}from"./useSearchModal-49z9J1R6.js";import{B as c}from"./Button-C_knowQX.js";import{D as S,a as f,b as M}from"./DialogTitle-D_DIVvaB.js";import{B as j}from"./Box-DQI8Jhin.js";import{S as r}from"./Grid-FoW9JHab.js";import{S as C}from"./SearchType-PXaQ2XWH.js";import{L as y}from"./List-BFqrCY8I.js";import{H as I}from"./DefaultResultListItem-mWbvTkJd.js";import{w as R}from"./appWrappers-z6NxJqlC.js";import{m as B}from"./makeStyles-Br0G-hkA.js";import{s as D,M as k}from"./api-DrXoM2Fb.js";import{S as v}from"./SearchContext-BHfokyX0.js";import{SearchBar as T}from"./SearchBar-CfcaljeO.js";import{S as b}from"./SearchResult-BguzYWEL.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CNs_elnA.js";import"./Plugin-B2KqZHWe.js";import"./componentData-qZciE7mF.js";import"./useAnalytics-Cjgpjhm8.js";import"./useApp-C5R7puQC.js";import"./useRouteRef-BjpYbkhm.js";import"./ArrowForward-90w8af0R.js";import"./translation-Bx6ibRNK.js";import"./Page-BCn4hxqI.js";import"./useMediaQuery-D8cltQib.js";import"./Divider-sHtYZKP3.js";import"./ArrowBackIos-Bjx62pCc.js";import"./ArrowForwardIos-Bvx1OI4P.js";import"./translation-u0hxjqwJ.js";import"./Modal-DCr6J3HP.js";import"./Portal-MO4PhXZB.js";import"./Backdrop-CSgO28eT.js";import"./styled-DYfYOEQM.js";import"./ExpandMore-DHVSTq_X.js";import"./useAsync-DngpNpKD.js";import"./useMountedState-CjwlO_ha.js";import"./AccordionDetails-Dd7pKb7g.js";import"./index-B9sM2jn7.js";import"./Collapse-9ymh8UbQ.js";import"./ListItem-T4Kaa4Sv.js";import"./ListContext-CxZLnUvv.js";import"./ListItemIcon-vSBS_DW2.js";import"./ListItemText-3zlpephB.js";import"./Tabs-C9gAxeRc.js";import"./KeyboardArrowRight-TY25FNfL.js";import"./FormLabel-CoucYDk-.js";import"./formControlState-NF-kz3Jo.js";import"./InputLabel-CwxVwmaI.js";import"./Select-CpnuzFNu.js";import"./Popover-CGkHhi4M.js";import"./MenuItem-BeDGG_TZ.js";import"./Checkbox-jzmJMdG6.js";import"./SwitchBase-CbYsFuEv.js";import"./Chip-D22N4aTf.js";import"./Link-DnWmf_w2.js";import"./index-CIy2Pw8-.js";import"./lodash-Cfs9LtR9.js";import"./WebStorage-B6vFWMkV.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Ck2mvxcb.js";import"./useIsomorphicLayoutEffect-72DB9J2o.js";import"./BUIProvider-Ciu3w9NY.js";import"./openLink-BCV1Ju3v.js";import"./Search-DPc8teHh.js";import"./useDebounce-CdUSirSI.js";import"./InputAdornment-B1sln0Im.js";import"./TextField-CiYIgQCO.js";import"./useElementFilter-Dlwg5cra.js";import"./EmptyState-ClY7Agb1.js";import"./Progress-DaajmS_g.js";import"./LinearProgress-BMtY-KbP.js";import"./ResponseErrorPanel-RW56rJ9L.js";import"./ErrorPanel-CYYHykPz.js";import"./WarningPanel-BxYnA6XA.js";import"./MarkdownContent-FGNp8B08.js";import"./CodeSnippet-tg7bz2Br.js";import"./CopyTextButton-lw-xGP4D.js";import"./useCopyToClipboard-DfOSg3XZ.js";import"./Tooltip-DJxyRh0l.js";import"./Popper-_e1X1nRB.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},no={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
